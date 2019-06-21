var express = require('express');
var router = express.Router();
var DB = new (require('../db'));
var fn = require('../source/function')
var md5 = require('md5')
DB.connect();
function setHeaders(res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","POST,GET");
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header("X-Powered-By",' 3.2.1')
}
/* GET users listing. */
router.get('/block/select', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var query = req.query.query;
		var k = req.query.k
		k = k.replace(/[&\|\\\^%$#@\-'":,.]/g,"");
		query = query.replace(/[&\|\\\^%$#@\-:,.]/g,"");
		if( md5(k) === "6c1edcec4a9440865069792984d82d91"){
			db.query('SELECT '+ query, function (error, results, fields) {
				if(error){
					console.log("mysql error")
					console.log(error)
					//db = DB.connect();
					res.send({"REE":error});
				}else{
					res.send(results);
				}
			})
		}else{
			res.send({"k":k,"md5(k)":md5(k)});
		}
	}catch(err){
		console.log(err)
		res.send({"REE1":err});
	}
});
router.get('/block/show', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var query = req.query.query;
		var k = req.query.k
		k = k.replace(/[&\|\\\^%$#@\-'":,.]/g,"");
		query = query.replace(/[&\|\\\^%$#@\-:,.]/g,"");
		if( md5(k) === "6c1edcec4a9440865069792984d82d91"){
			db.query('SHOW '+ query, function (error, results, fields) {
				if(error){
					console.log("mysql error")
					console.log(error)
					res.send({"REE":error});
					//db = DB.connect();
				}else{
					res.send(results);
				}
			})
		}else{
			res.send({"k":k,"md5(k)":md5(k)});
		}
	}catch(err){
		console.log(err)
		res.send({"REE1":err});
	}
});
router.get('/block/explain', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var query = req.query.query;
		var k = req.query.k
		k = k.replace(/[&\|\\\^%$#@\-'":,.]/g,"");
		query = query.replace(/[&\|\\\^%$#@\-:,.]/g,"");
		if( md5(k) === "6c1edcec4a9440865069792984d82d91"){
			db.query('EXPLAIN '+ query, function (error, results, fields) {
				if(error){
					console.log("mysql error")
					console.log(error)
					res.send({"REE":error});
					//db = DB.connect();
				}else{
					res.send(results);
				}
			})
		}else{
			res.send({"k":k,"md5(k)":md5(k)});
		}
	}catch(err){
		console.log(err)
		res.send({"REE1":err});
	}
});

router.get('/serverInfo', function(req, res, next) {
	setHeaders(res);
	try{
		var time = new Date().getTime()
		var results = {"code":"1","s_time":time}
		res.send(results);
	}catch(err){
		console.log(err)
	}
});


router.get('/block/current', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		db.query('SELECT * FROM `chain_did_property` ORDER BY `height` desc LIMIT 1', function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
				//db = DB.connect();
			}else{
				res.send(results);
			}
		})
	}catch(err){
		console.log(err)
	}
});
router.get('/block/current/height', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		db.query('SELECT height FROM `chain_block_header` ORDER BY `id` desc LIMIT 1', function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
				//db = DB.connect();
			}else{
				res.send(results);
			}
		})
	}catch(err){
		console.log(err)
	}
});
router.get('/block/height', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		db.query('SELECT `height` FROM `chain_did_property`  ORDER BY `height` desc LIMIT 1', function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error);
			}else{
				res.send(results);
			}
		})
	}catch(err){
		console.log(err)
	}
});
router.get('/block/info', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var height = req.query.height;
		db.query('SELECT * FROM `chain_block_header` WHERE `height` = ' + height + ' LIMIT 1', function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error);
			}else{
				res.send(results);
			}
		})
	}catch(err){
		console.log(err)
	}
});

router.get('/block/blocks/count', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		db.query('SELECT count(distinct `height`) AS count FROM `chain_did_property`', function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error);
			}else{
				res.send(results);
			}
		})
		/*db.query('SELECT count(*) AS count FROM (SELECT `height` FROM `chain_did_property` GROUP BY `height`) AS h ', function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error);
			}else{
				res.send(results);
			}
		})*/
	}catch(err){
		console.log(err)
	}
});
router.get('/block/blocks', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var start = req.query.start;
		var pageSize = req.query.pageSize;

		db.query('SELECT distinct `height` FROM `chain_did_property` ORDER BY `height` DESC LIMIT ' + start + ',' + pageSize, function(error, results, fields){
			if(error){
				console.log("mysql error")
				console.log(error);
			}else{
				res.send(results);
			}
		})
	}catch(err){
		console.log(err)
	}
});

router.get('/block/blocks_info',function(req, res, next){
	setHeaders(res);
	try{
		var db =  DB.connection;
		var height = req.query.height;
		db.query('SELECT time,miner_info ,size  FROM `chain_block_header` WHERE `height` = '+ height 
		, function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
			}else{
				res.send(results);
			}
		})
	}catch(err){
		console.log(err)
	}

})

router.get('/block/transactions_count', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var height = req.query.height;
		db.query('SELECT `height`,`txid` FROM chain_did_property  WHERE `height` = '+ height +' GROUP BY `txid`'
		, function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
			}else{
				res.send([{count:results.length}]);
			}
		})
	}catch(err){
		console.log(err)
	}
});
router.get('/block/transactions/txids_height', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var height = req.query.height;
		db.query('SELECT `txid` FROM `chain_block_transaction_history`  WHERE `height` = ' + height + ' AND `txType` = "TransferAsset" GROUP BY `txid` ORDER BY `id` DESC', function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
			}else{
				res.send(results);
			}
		})
	}catch(err){
		console.log(err)
	}
});

router.get('/block/transactions/height', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var height = req.query.height;
		var start = req.query.start;
		var pageSize = req.query.pageSize;
		db.query('SELECT a.id,a.txid,a.height,b.txid,b.createTime,a.did,a.did_status,b.memo,b.fee,b.type FROM `chain_did_property` AS a LEFT JOIN `chain_block_transaction_history` AS b ON (a.txid=b.txid) WHERE (a.height = '+ height + ' AND  b.type = "spend") GROUP BY a.txid ORDER BY a.id DESC LIMIT '+ start + ',' + pageSize, function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
			}else{
				
				res.send(results);
			}
		})
	}catch(err){
		console.log(err)
	}
});
router.get('/block/values', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var txid = req.query.txid;
		db.query('SELECT sum(a.value) value FROM `chain_block_transaction_history` a  WHERE a.txid = "' + txid + '" AND a.type = "spend"', function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
			}else{
				res.send(results);
			}
		})
	}catch(err){
		console.log(err)
	}
});

router.get('/block/transactions/txid', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var txid = req.query.txid;
		db.query('SELECT * FROM `chain_block_transaction_history`  WHERE `txid` = "' + txid + '" AND `txType` = "TransferAsset" AND `type` = "spend" GROUP BY `txid` ORDER BY `id` DESC', function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
			}else{
				res.send(results);
			}
		})
	}catch(err){
		console.log(err)
	}
});

router.get('/block/transactions', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var start = req.query.start;
		var pageSize = req.query.pageSize;
		/*db.query('SELECT id, did, txid, height FROM `chain_did_property` GROUP BY `txid`ORDER BY id DESC LIMIT ' + start + ',' + pageSize
		, function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
			}else{
				res.send(results);
			}
		})*/

		db.query('SELECT  distinct did, txid, height FROM `chain_did_property` ORDER BY id DESC LIMIT ' + start + ',' + pageSize
		, function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
			}else{
				res.send(results);
			}
		})

	}catch(err){
		console.log(err)
	}
});
router.get('/block/transactions_info', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var txid = req.query.txid;
		db.query('SELECT createTime,length(memo) as `length_memo`, fee, value FROM `chain_block_transaction_history` WHERE `type` = "spend" and `txid` = "'+ txid +'"'
		, function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
			}else{
				res.send(results);
			}
		})
	}catch(err){
		console.log(err)
	}
});



router.get('/block/transactions/count', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;

		db.query('SELECT count(distinct `txid` ) AS count FROM `chain_did_property`', function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
			}else{
				res.send(results);
			}
		})
	}catch(err){
		console.log(err)
	}
});

router.get('/block/transactions/info', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var txid = req.query.txid;
		db.query('SELECT * FROM (SELECT * FROM `chain_did_property` WHERE txid = "'+ txid +'" ORDER BY `block_time` DESC) a GROUP BY `property_key`', function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
			}else{
				res.send(results);
			}
		})
	}catch(err){

	}
});

router.get('/block/transactions/did', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var did = req.query.did;
		db.query('SELECT * FROM `chain_did_property`  WHERE `did` = "' + did + '" ORDER BY `id` DESC LIMIT 5', function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
			}else{
				res.send(results);
			}
		})
	}catch(err){
		console.log(err)
	}
});
router.get('/block/properteis/did', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var did = req.query.did;
		db.query('SELECT * FROM (SELECT * FROM `chain_did_property` WHERE did = "'+ did +'" ORDER BY `block_time` DESC) a GROUP BY `property_key`', function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
			}else{
				res.send(results);
			}
		})
	}catch(err){
		console.log(err)
	}
});

router.get('/block/properteis/history', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var key = req.query.key;
		var did = req.query.did;
		var start = req.query.start;
		var pageSize = req.query.pageSize;
		db.query('SELECT * FROM `chain_did_property`  WHERE `did` = "' + did + '" AND `property_key` = "' + key + '" ORDER BY `id` DESC LIMIT ' + start + ',' + pageSize, function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
			}else{
				res.send(results);
			}
		})
	}catch(err){
		console.log(err)
	}
});
router.get('/block/properteis/history/count', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var key = req.query.key;
		var did = req.query.did;
		db.query('SELECT count(*) AS count FROM `chain_did_property`  WHERE `did` = "' + did + '" AND `property_key` = "' + key +'"', function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
			}else{
				console.log(results)
				res.send(results);
			}
		})
	}catch(err){
		console.log(err)
	}
});

router.get('/block/dids', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var start = req.query.start;
		var pageSize = req.query.pageSize;
		db.query('SELECT  distinct did FROM `chain_did_property` ORDER BY id DESC LIMIT ' + start + ',' + pageSize, function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
			}else{
				res.send(results);
			}
		})
	}catch(err){
		console.log(err)
	}
});
router.get('/block/dids/count', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		db.query('SELECT count(distinct `did` ) AS count FROM `chain_did_property`', function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
			}else{
				res.send(results);
			}
		})
	}catch(err){
		console.log(err)
	}
});
router.get('/block/did/info', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var did = req.query.did;
		db.query('SELECT * FROM `chain_did_property` WHERE `did` = "'+did+'" LIMIT 1', function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
			}else{
				res.send(results);
			}
		})
	}catch(err){
		console.log(err)
	}
});
router.get('/block/getAddressInfo', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var address = req.query.address;
		db.query('SELECT * FROM `chain_block_transaction_history` WHERE `address` = "'+address+'"', function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
			}else{
				res.send(results);
			}
		})
	}catch(err){
		console.log(err)
	}
});
router.get('/block/getReport', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var type = req.query.type;
		if(type === "transactions"){
			type ="txid"
		}
		var range = req.query.range;
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
		/*db.query('SELECT count(distinct `'+type+'` ) AS count FROM `chain_did_property` where `local_system_time` < "'+option.startTime+'" ', function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
			}else{
				var totalStart = results[0].count;*/
				var arr_new = [];
				//var arr_total = [];
				option.timeArr.map((v,k)=>{
					db.query('SELECT count(distinct `'+type+'` ) AS count FROM `chain_did_property` WHERE `local_system_time` < "'+v.t+'" AND `local_system_time` >= "'+v.s+'"', function (error, results1, fields) {
						if(error){
							console.log("mysql error")
							console.log(error)
						}else{
							arr_new.push({"k":k,"count":results1[0].count})
							//totalStart += results1[0].count
							//arr_total.push({"k":k,"count":totalStart})
							if(arr_new.length === option.data_count){
								//var data = {"type":type,"range":range,"start_time":option.startTime,"data_new":arr_new,"data_total":arr_total};
								var data = {"type":type,"range":range,"start_time":option.startTime,"data_new":arr_new};
								
								res.send(data);
							}
						}
					})	
				})
		/*	}
		})*/

		
	}catch(err){
		console.log(err)
	}
});


router.get('/block/getReportTotal', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var type = req.query.type;
		if(type === "transactions"){
			type ="txid"
		}
		var range = req.query.range;
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
		option.startTime = fn.timestampToTime(timestamp -  (option.data_count - 1)  * option.rate / option.data_count * 1000, option.time_format1);
		db.query('SELECT count(distinct `'+type+'` ) AS count FROM `chain_did_property` where `local_system_time` < "'+option.startTime+'" ', function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
			}else{
				res.send(results);
			}
		})
	}catch(err){
		console.log(err)
	}
});


router.get('/block/eapps', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var start = req.query.start;
		var pageSize = req.query.pageSize;
		db.query('SELECT * FROM `chain_did_app` WHERE `info_type` = "app_name" GROUP BY `info_value` ORDER BY id DESC LIMIT ' + start + ',' + pageSize , function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
			}else{
				res.send(results);
			}
		})
	}catch(err){
		console.log(err)
	}
});

router.get('/block/eapps/count', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		db.query('COUNT(*) AS count FROM (SELECT * FROM `chain_did_app` WHERE `info_type` = "app_name" GROUP BY `info_value` ) AS a', function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
			}else{
				res.send(results);
			}
		})
		
	}catch(err){
		console.log(err)
	}
});
router.get('/block/eapp/info', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var appid = req.query.appid;
		db.query('SELECT * FROM `chain_did_app` WHERE `info_type` = "app_name" AND `property_value` = "'+ appid +'" ORDER BY id DESC LIMIT ' + start + ',' + pageSize , function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
			}else{
				res.send(results);
			}
		})
	}catch(err){
		console.log(err)
	}
});
module.exports = router;
