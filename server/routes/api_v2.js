var express = require('express');
var router = express.Router();
var DB = new (require('../db'));
var fn = require('../source/function')

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
		var fields = req.query.fields;
		var table = req.query.table;
		var order = req.query.order
		var limit = req.query.limit;
		db.query('SELECT '+ fields + ' FROM ' + table + ' ORDER BY ' +order+ ' LIMIT ' + limit, function (error, results, fields) {
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

router.get('/block/getReport', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var type = req.query.type;
		var range = req.query.range;
		console.log(type)
		var timestamp = new Date().getTime();
		if (type === "did"){
			var colume = "did"
		}else if(type === "transactions"){
			var colume = "txid"
		}else{
			res.send("");
		}
		if(range === "1H"){
			var rate = 3600;
			var time = fn.timestampToTime(timestamp - rate * 1000, "YMDhi");
			var time_format = "%Y-%m-%d %H:%i";
			var data_count = 60;
			var time_format1 = "YMDhi"
		}else if (range === "24H"){
			var rate =  24 * 3600 
			var time = fn.timestampToTime(timestamp - rate * 1000,"YMDh");
			var time_format = "%Y-%m-%d %H";
			var data_count = 24;
			var time_format1 = "YMDh"
		}else if(range === "1W"){
			var rate = 7 * 24 * 3600 
			var time = fn.timestampToTime(timestamp - rate * 1000,"YMD");
			var time_format = "%Y-%m-%d";
			var data_count = 7;
			var time_format1 = "YMD"
		}else if(range === "1M"){
			var rate = 30 * 24 * 3600 
			var time = fn.timestampToTime(timestamp - rate * 1000,"YMD");
			var time_format = "%Y-%m-%d";
			var data_count = 30;
			var time_format1 = "YMD"
		}else if(range === "1Y"){
			var rate = 12 * 30 * 24 * 3600 
			var time = fn.timestampToTime(timestamp -  rate * 1000,"YM");
			var time_format = "%Y-%m";
			var data_count = 12;
			var time_format1 = "YM"
		}else{
			res.send("");
		}


		var startTime = fn.timestampToTime(timestamp -  (data_count - 2)  * rate / data_count * 1000, time_format1);
		console.log('SELECT count(distinct `'+colume+'` ) AS count FROM `chain_did_property` where `local_system_time` < "'+startTime+'" ')
		db.query('SELECT count(distinct `'+colume+'` ) AS count FROM `chain_did_property` where `local_system_time` < "'+startTime+'" ', function (error, results1, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
			}else{
				console.log('SELECT DATE_FORMAT(`local_system_time`,"' + time_format + '") as local_time , count('+colume+') as count from ( SELECT '+colume+',local_system_time from `chain_did_property` where `local_system_time` > "'+time+'" group by '+colume+' ) as a group by local_time')
				db.query('SELECT DATE_FORMAT(`local_system_time`,"' + time_format + '") as local_time , count('+colume+') as count from ( SELECT '+colume+',local_system_time from `chain_did_property` where `local_system_time` > "'+time+'" group by '+colume+' ) as a group by local_time', function (error, results, fields) {
					if(error){
						console.log("mysql error")
						console.log(error)
					}else{
						var totalStart = results1[0].count;
						var arr_new = [];
						var arr_total = [];
						for(var i = 0 ;i< data_count ;i++){
							var t = fn.timestampToTime(timestamp -  (data_count - i - 2 ) * rate / data_count * 1000, time_format1);
							var c = 0
							results.map((v,k)=>{
								if(v.local_time === t){
									c = v.count
								}
							})
							arr_new.push(c)
							totalStart += c
							arr_total.push(totalStart)
						}
						res.send({"startTime":startTime,"data_total":arr_total,"data_new":arr_new});
					}
				})
			}
		})



		
	}catch(err){
		console.log(err)
	}
});
module.exports = router;
