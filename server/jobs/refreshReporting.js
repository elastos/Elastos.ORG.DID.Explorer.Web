var http     = require('http');
var schedule = require("node-schedule");
var fn = require('../source/function')
var DB = new (require('../db'));
class RefreshReporting {
	constructor(){
		this.hasReporting = false;
		DB.connect();
		this.db =  DB.connection;
		this.ranges = ["1H","24H","1W","1M","1Y"];
		this.columes = ["did","txid"];
	}
	run(){
        this.ranges.map((v,k)=>{
        	this.jobsWithRange(v)
        })
	}
	jobsWithRange(range){
		var rule  = new schedule.RecurrenceRule();
		var self = this;
		var rule;
		switch(range){
			case "1H":  rule = '0 * * * * *'; break;
			case "24H": rule = '0 0 * * * *'; break;
			case "1W":  rule = '15 10 * * * *'; break;
			case "1M":  rule = '30 20 * * * *'; break;
			case "1Y":  rule = '45 30 * * * *'; break;
		}
		schedule.scheduleJob(rule, function(){
		 	if(self.hasReporting){
		 		console.log("have Reporting")
		 		var option = self.initParams(range)
		 		self.columes.map((cv,k)=>{
		 			self.db.query('SELECT count(distinct `'+cv+'` ) AS count FROM `chain_did_property` where `local_system_time` < "'+option.startTime+'" ', function (error, results, fields) {
						if(error){
							console.log("mysql error")
							console.log(error)
						}else{
							var totalStart = results[0].count;
							var arr_new = [];
							var arr_total = [];
							option.timeArr.map((v,k)=>{
								self.db.query('SELECT count(distinct `'+cv+'` ) AS count FROM `chain_did_property` WHERE `local_system_time` < "'+v.t+'" AND `local_system_time` >= "'+v.s+'"', function (error, results1, fields) {
									if(error){
										console.log("mysql error")
										console.log(error)
									}else{
										arr_new.push({"k":k,"count":results1[0].count})
										totalStart += results1[0].count
										arr_total.push({"k":k,"count":totalStart})
										if(arr_new.length === option.data_count){
											var data = {"type":cv,"range":range,"start_time":option.startTime,"data_new":arr_new,"data_total":arr_total};
											self.insertReporting(data)
										}
									}
								})	
							})
						}
					})

		 		})
		 	}else{
		 		console.log("have no Reporting")
		 		self.hasReportingTable()
		 	}
		})
	}
	hasReportingTable(){
		var self = this;
		self.db.query("show tables like 'chain_reporting'", function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
				
			}else{
				console.log(results.length)
				results.length == 0 ? self.createReporting() : self.hasReporting = true;
				//res.send(results);
			}
		})
		//console.log("asdfasdfasdf")
		
	}
	createReporting(){
		var self = this;
		console.log("createReporting")
		self.db.query("CREATE TABLE `chain_reporting` (`id` int(11) NOT NULL, `type` varchar(20) NOT NULL, `start_time` varchar(30) NOT NULL, `data_total` varchar(5000) NOT NULL, `data_new` varchar(5000) NOT NULL, `date_range` varchar(20) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
				
			}else{
				console.log(results)
				//res.send(results);
			}
		})
	}
	insertReporting(data){
		var self = this;
		if(data !== null){
			self.db.query('SELECT `id` FROM `chain_reporting` WHERE `type` = "'+data.type+'" AND `date_range` = "'+data.range+'"',function (error, results, fields) {
				if(error){
					console.log("mysql error")
					console.log(error)
					
				}else{
					console.log(results)
					if(results.length > 0){
						console.log('UPDATE `chain_reporting` SET `start_time` = "'+data.start_time+'" , `data_total` = \''+JSON.stringify(data.data_total)+'\', `data_new` = \''+JSON.stringify(data.data_new)+'\' WHERE `type` = "'+data.type+'" AND `date_range` = "'+data.range+'"')
						self.db.query('UPDATE `chain_reporting` SET `start_time` = "'+data.start_time+'" , `data_total` = \''+JSON.stringify(data.data_total)+'\', `data_new` = \''+JSON.stringify(data.data_new)+'\' WHERE `type` = "'+data.type+'" AND `date_range` = "'+data.range+'"',function (error, results, fields) {
							if(error){
								console.log("mysql error")
								console.log(error)
							}else{
								console.log(results)
								
								
							}
						})
					}else{
						console.log('INSERT INTO `chain_reporting` SET  `start_time` = "'+data.start_time+'" , `data_total` = \''+JSON.stringify(data.data_total)+'\', `data_new` = \''+JSON.stringify(data.data_new)+'\',`type` = "'+data.type+'" ,`date_range` = "'+data.range+'" ')
						self.db.query('INSERT INTO `chain_reporting` SET  `start_time` = "'+data.start_time+'" , `data_total` = \''+JSON.stringify(data.data_total)+'\', `data_new` = \''+JSON.stringify(data.data_new)+'\',`type` = "'+data.type+'" ,`date_range` = "'+data.range+'"',function (error, results, fields) {
							if(error){
								console.log("mysql error")
								console.log(error)
								
							}else{
								
							}
						})	
					}
				}
			})
		}
		
	}
	initParams(range){
		try{
			var option = {};
			var timestamp = new Date().getTime();
			if(range === "1H"){
				option.rate = 3600;
				option.time = fn.timestampToTime(timestamp - option.rate * 1000, "YMDhi");
				option.time_format = "%Y-%m-%d %H:%i";
				option.data_count = 60;
				option.time_format1 = "YMDhi";
			}else if (range === "24H"){
				option.rate =  24 * 3600 
				option.time = fn.timestampToTime(timestamp - option.rate * 1000,"YMDh");
				option.time_format = "%Y-%m-%d %H";
				option.data_count = 24;
				option.time_format1 = "YMDh"
			}else if(range === "1W"){
				option.rate = 7 * 24 * 3600 
				option.time = fn.timestampToTime(timestamp - option.rate * 1000,"YMD");
				option.time_format = "%Y-%m-%d";
				option.data_count = 7;
				option.time_format1 = "YMD"
			}else if(range === "1M"){
				option.rate = 30 * 24 * 3600 
				option.time = fn.timestampToTime(timestamp - option.rate * 1000,"YMD");
				option.time_format = "%Y-%m-%d";
				option.data_count = 30;
				option.time_format1 = "YMD"
			}else if(range === "1Y"){
				option.rate = 12 * 30 * 24 * 3600 
				option.time = fn.timestampToTime(timestamp -  option.rate * 1000,"YM");
				option.time_format = "%Y-%m";
				option.data_count = 12;
				option.time_format1 = "YM"
			}
			option.timeArr = []
			for(var i = 0 ;i< option.data_count ;i++){
				var t = fn.timestampToTime(timestamp -  (option.data_count - i - 2 ) * option.rate / option.data_count * 1000, option.time_format1);
				var t1 = fn.timestampToTime(timestamp -  (option.data_count - i - 1 ) * option.rate / option.data_count * 1000, option.time_format1);
				option.timeArr.push({"s":t1,"t":t})
			}
			option.startTime = fn.timestampToTime(timestamp -  (option.data_count - 1)  * option.rate / option.data_count * 1000, option.time_format1);
			return option;
		}catch(err){
			console.log(err)
		}
	}
}
module.exports = RefreshReporting;