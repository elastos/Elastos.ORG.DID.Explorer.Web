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
router.get('/v1/block/current', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		db.query('SELECT * FROM `chain_block_transaction_history` WHERE `txType` = "TransferAsset" ORDER BY `id` desc LIMIT 1', function (error, results, fields) {
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
		db.query('SELECT `height` FROM `chain_block_transaction_history` WHERE `txType` = "TransferAsset" ORDER BY `id` desc LIMIT 1', function (error, results, fields) {
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
		db.query('SELECT * FROM `chain_block_transaction_history`  WHERE `height` = ' + height + ' AND `txType` = "TransferAsset" GROUP BY `txid` ORDER BY `id` DESC', function (error, results, fields) {
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
		db.query('SELECT * FROM `chain_block_transaction_history`  WHERE `txid` = "' + txid + '" AND `txType` = "TransferAsset" GROUP BY `txid` ORDER BY `id` DESC', function (error, results, fields) {
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
		console.log('SELECT `id`,`txid`,`createTime`,`height`,length(`memo`) as `length_memo` ,`local_system_time` FROM `chain_block_transaction_history` WHERE `txType` = "TransferAsset" GROUP BY `txid` ORDER BY `id` DESC LIMIT ' + start + ',' + pageSize )
		db.query('SELECT `id`,`txid`,`createTime`,`height`,length(`memo`) as `length_memo` ,`local_system_time` FROM `chain_block_transaction_history` WHERE `txType` = "TransferAsset" GROUP BY `txid` ORDER BY `id` DESC LIMIT ' + start + ',' + pageSize, function (error, results, fields) {
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
router.get('/v1/block/transactions/count', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		db.query('SELECT COUNT(*) AS count FROM ( SELECT `txid`,`txType` FROM `chain_block_transaction_history` WHERE `txType` = "TransferAsset" GROUP BY `txid`) AS a ', function (error, results, fields) {
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

router.get('/v1/block/transactions/info', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var txid = req.query.txid;
		db.query('SELECT * FROM `chain_did_property`  WHERE `txid` = "' + txid + '"', function (error, results, fields) {
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
		db.query('SELECT * FROM `chain_did_property`  WHERE `did` = "' + did + '" GROUP BY `property_key` ORDER BY `id` DESC ', function (error, results, fields) {
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
