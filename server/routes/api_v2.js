var express = require('express');
var router = express.Router();
var DB = new (require('../db'));
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
		db.query('SELECT createTime,length(memo) as `length_memo`, fee FROM `chain_block_transaction_history` WHERE `type` = "spend" and `txid` = "'+ txid +'"'
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

router.get('/block/didTotal', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var type = req.query.type;
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
module.exports = router;
