var express = require('express');
var router = express.Router();
var DB = new (require('../db'));
DB.connect();
function setHeaders(res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header("X-Powered-By",' 3.2.1')
}
/* GET users listing. */
router.get('/v1/block/select', function(req, res, next) {
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


router.get('/v1/block/current', function(req, res, next) {
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
router.get('/v1/block/current/height', function(req, res, next) {
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
router.get('/v1/block/height', function(req, res, next) {
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
router.get('/v1/block/info', function(req, res, next) {
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

router.get('/v1/block/blocks/count', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		db.query('SELECT `height` FROM `chain_did_property` GROUP BY `height`', function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error);
			}else{
				res.send([{"count":results.length}]);
			}
		})
	}catch(err){
		console.log(err)
	}
});
router.get('/v1/block/blocks', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var start = req.query.start;
		var pageSize = req.query.pageSize;

		db.query('SELECT `height` FROM `chain_did_property` GROUP BY `height` ORDER BY `height` DESC LIMIT ' + start + ',' + pageSize, function(error, results, fields){
			if(error){
				console.log("mysql error")
				console.log(error);
			}else{
				results.map((v,k)=>{
					db.query('SELECT time,miner_info ,size  FROM `chain_block_header` WHERE `height` = '+ v.height 
					, function (error, result1, fields) {
						if(error){
							console.log("mysql error")
							console.log(error)
						}else{
							db.query('SELECT `height`,`txid` FROM chain_did_property  WHERE `height` = '+ v.height +' GROUP BY `txid`'
							, function (error, result2, fields) {
								if(error){
									console.log("mysql error")
									console.log(error)
								}else{
									if(result1[0]){
										results[k].time = result1[0].time;
										results[k].miner_info = result1[0].miner_info;
										results[k].size = result1[0].size;
									}
									results[k].count = result2.length
									if(k == results.length - 1){
										res.send(results);
									}
								}
							})
						}
					})
				})
			}
		})
	}catch(err){
		console.log(err)
	}
});

router.get('/v1/block/transactions/txids_height', function(req, res, next) {
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

router.get('/v1/block/transactions/height', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var height = req.query.height;
		db.query('SELECT a.id,a.txid,a.height,b.txid,b.createTime,a.did,a.did_status,b.memo,b.fee,b.type FROM `chain_did_property` AS a LEFT JOIN `chain_block_transaction_history` AS b ON (a.txid=b.txid) WHERE (a.height = '+ height + ' AND  b.type = "spend") GROUP BY a.txid ORDER BY a.id DESC', function (error, results, fields) {
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
router.get('/v1/block/values', function(req, res, next) {
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

router.get('/v1/block/transactions/txid', function(req, res, next) {
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

router.get('/v1/block/transactions', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var start = req.query.start;
		var pageSize = req.query.pageSize;
		db.query('SELECT id, did, txid, height FROM `chain_did_property` GROUP BY txid ORDER BY id DESC LIMIT ' + start + ',' + pageSize
		, function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
			}else{
				results.map((v,k)=>{
					db.query('SELECT createTime,length(memo) as `length_memo` FROM `chain_block_transaction_history` WHERE `type` = "spend" and `txid` = "'+ v.txid +'"'
					, function (error, result, fields) {
						if(error){
							console.log("mysql error")
							console.log(error)
						}else{
							if(result[0]){
								results[k].createTime = result[0].createTime;
								results[k].length_memo = result[0].length_memo;
							}
							if(k == results.length - 1){
								res.send(results);
							}
						}
					})
					
				})
				
			}
		})

	}catch(err){
		console.log(err)
	}
});
router.get('/v1/block/transactions/count', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;

		db.query('SELECT `txid` FROM `chain_did_property` GROUP BY `txid`', function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
			}else{
				res.send([{"count":results.length}]);
			}
		})
	}catch(err){
		console.log(err)
	}
});

router.get('/v1/block/transactions/info', function(req, res, next) {
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

router.get('/v1/block/transactions/did', function(req, res, next) {
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
router.get('/v1/block/properteis/did', function(req, res, next) {
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

router.get('/v1/block/properteis/history', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var key = req.query.key;
		var did = req.query.did;
		db.query('SELECT * FROM `chain_did_property`  WHERE `did` = "' + did + '" AND `property_key` = "' + key + '" ORDER BY `id` DESC LIMIT 20', function (error, results, fields) {
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
