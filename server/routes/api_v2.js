var express = require('express');
var router = express.Router();
var DB = new (require('../db'));
var fn = require('../source/function');
var md5 = require('md5');
var api_host_node = "https://api-wallet-did.elastos.org" ;
var request = require('request');
DB.connect();
function setHeaders(res){
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","POST,GET");
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header("X-Powered-By",' 3.2.1')
}


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
		db.getConnection(function(err,conn){
			conn.query('SELECT * FROM `chain_did_property` ORDER BY `height` desc LIMIT 1', function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
					//db = DB.connect();
				}else{
					res.send(results);
				}
			})
		})
	}catch(err){
		console.log(err)
	}
});
router.get('/block/current/height', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		db.getConnection(function(err,conn){
			conn.query('SELECT height FROM `chain_block_header` ORDER BY `id` desc LIMIT 1', function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
					//db = DB.connect();
				}else{
					res.send(results);
				}
			})
		})
	}catch(err){
		console.log(err)
	}
});
router.get('/block/height', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		db.getConnection(function(err,conn){
			conn.query('SELECT `height` FROM `chain_did_property`  ORDER BY `height` desc LIMIT 1', function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error);
				}else{
					res.send(results);
				}
			})
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
		db.getConnection(function(err,conn){
			conn.query('SELECT * FROM `chain_block_header` WHERE `height` = ' + height + ' LIMIT 1', function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error);
				}else{
					res.send(results);
				}
			})
		})
	}catch(err){
		console.log(err)
	}
});

router.get('/block/blocks/count', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		db.getConnection(function(err,conn){
			conn.query('SELECT count(distinct `height`) AS count FROM `chain_did_property`', function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error);
				}else{
					res.send(results);
				}
			})
			/*db.getConnection(function(err,conn){
			conn.query('SELECT count(*) AS count FROM (SELECT `height` FROM `chain_did_property` GROUP BY `height`) AS h ', function (error, results, fields) {
				if(error){
					console.log("mysql error")
					console.log(error);
				}else{
					res.send(results);
				}
			})*/
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
		db.getConnection(function(err,conn){
			conn.query('SELECT distinct `height` FROM `chain_did_property` ORDER BY `height` DESC LIMIT ' + start + ',' + pageSize, function(error, results, fields){
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error);
				}else{
					res.send(results);
				}
			})
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
		db.getConnection(function(err,conn){
			conn.query('SELECT time,miner_info ,size  FROM `chain_block_header` WHERE `height` = '+ height 
			, function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send(results);
				}
			})
		})
	}catch(err){
		console.log(err)
	}

})
router.get('/block/blocks_last',function(req, res, next){
	setHeaders(res);
	try{
		var db =  DB.connection;
		db.getConnection(function(err,conn){
			conn.query('SELECT height  FROM `chain_block_header` ORDER BY height DESC LIMIT 1'
			, function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send(results);
				}
			})
		})
	}catch(err){
		console.log(err)
	}
})
router.get('/block/blocks_first',function(req, res, next){
	setHeaders(res);
	try{
		var db =  DB.connection;
		db.getConnection(function(err,conn){
			conn.query('SELECT height  FROM `chain_block_header` ORDER BY height LIMIT 1'
			, function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send(results);
				}
			})
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
		db.getConnection(function(err,conn){
			conn.query('SELECT `height`,`txid` FROM chain_did_property  WHERE `height` = '+ height +' GROUP BY `txid`'
			, function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send([{count:results.length}]);
				}
			})
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
		db.getConnection(function(err,conn){
			conn.query('SELECT `txid` FROM `chain_block_transaction_history`  WHERE `height` = ' + height + ' AND `txType` = "TransferAsset" GROUP BY `txid` ORDER BY `id` DESC', function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send(results);
				}
			})
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
		db.getConnection(function(err,conn){
			conn.query('SELECT a.id,a.txid,a.height,b.txid,b.createTime,a.did,a.did_status,b.memo,b.fee,b.type FROM `chain_did_property` AS a LEFT JOIN `chain_block_transaction_history` AS b ON (a.txid=b.txid) WHERE (a.height = '+ height + ' AND  b.type = "spend") GROUP BY a.txid ORDER BY a.id DESC LIMIT '+ start + ',' + pageSize, function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					
					res.send(results);
				}
			})
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
		db.getConnection(function(err,conn){
			conn.query('SELECT sum(a.value) value FROM `chain_block_transaction_history` a  WHERE a.txid = "' + txid + '" AND a.type = "spend"', function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send(results);
				}
			})
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
		db.getConnection(function(err,conn){
			conn.query('SELECT * FROM `chain_block_transaction_history`  WHERE `txid` = "' + txid + '" AND `type` = "spend"   ORDER BY `id` DESC', function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send(results);
				}
			})
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
		/*db.getConnection(function(err,conn){
		conn.query('SELECT id, did, txid, height FROM `chain_did_property` GROUP BY `txid`ORDER BY id DESC LIMIT ' + start + ',' + pageSize
		, function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
			}else{
				res.send(results);
			}
		})*/
		db.getConnection(function(err,conn){
			conn.query('SELECT  distinct did, txid, height FROM `chain_did_property` ORDER BY id DESC LIMIT ' + start + ',' + pageSize
			, function (error, results, fields) {
				conn.release();
				
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send(results);
				}
			})
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
		db.getConnection(function(err,conn){
			conn.query('SELECT createTime,length(memo) as `length_memo`, fee, value FROM `chain_block_transaction_history`  WHERE `txid` = "'+ txid +'"'
			, function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send(results);
				}
			})
		})
	}catch(err){
		console.log(err)
	}
});



router.get('/block/transactions/count', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		db.getConnection(function(err,conn){
			conn.query('SELECT count(distinct `txid` ) AS count FROM `chain_did_property`', function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send(results);
				}
			})
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
		db.getConnection(function(err,conn){
			conn.query('SELECT * FROM (SELECT * FROM `chain_did_property` WHERE txid = "'+ txid +'" ORDER BY `block_time` DESC) a GROUP BY `property_key`', function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send(results);
				}
			})
		})
	}catch(err){

	}
});

router.get('/block/transactions/did', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var did = req.query.did;
		db.getConnection(function(err,conn){
			conn.query('SELECT * FROM `chain_did_property`  WHERE `did` = "' + did + '" ORDER BY `id` DESC LIMIT 5', function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send(results);
				}
			})
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
		db.getConnection(function(err,conn){
			conn.query('SELECT * FROM (SELECT * FROM `chain_did_property` WHERE did = "'+ did +'" ORDER BY `block_time` DESC) a GROUP BY `property_key`', function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send(results);
				}
			})
		})
	}catch(err){
		console.log(err)
	}
});


router.get('/block/address/txid', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var txid = req.query.txid;
		db.getConnection(function(err,conn){
			conn.query('SELECT * FROM `chain_block_transaction_history` WHERE `txid` = "'+txid+'" ORDER BY `id` DESC LIMIT 1', function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send(results);
				}
			})
		})
	}catch(err){
		console.log(err)
	}
});
router.get('/block/did/txid', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var txid = req.query.txid;
		db.getConnection(function(err,conn){
			conn.query('SELECT * FROM `chain_did_property` WHERE `txid` = "'+txid+'" ORDER BY `id` DESC LIMIT 1', function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send(results);
				}
			})
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
		db.getConnection(function(err,conn){
			conn.query('SELECT * FROM `chain_did_property`  WHERE `did` = "' + did + '" AND `property_key` = "' + key + '" ORDER BY `id` DESC LIMIT ' + start + ',' + pageSize, function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send(results);
				}
			})
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
		db.getConnection(function(err,conn){
			conn.query('SELECT count(*) AS count FROM `chain_did_property`  WHERE `did` = "' + did + '" AND `property_key` = "' + key +'"', function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					console.log(results)
					res.send(results);
				}
			})
		})
	}catch(err){
		console.log(err)
	}
});

router.get('/block/dids_index', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var limit = req.query.limit; 
		db.getConnection(function(err,conn){
			var query = 'SELECT did FROM `chain_did_property` ORDER BY `id` DESC LIMIT '+limit
			//var query = 'SELECT `did` FROM `chain_did_property` GROUP BY `did` ORDER BY `block_time` DESC LIMIT ' + start + ',' + pageSize
			conn.query(query, function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send(results);
				}
			})
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
		db.getConnection(function(err,conn){

			var query = 'SELECT  distinct did FROM `chain_did_property` ORDER BY `id` DESC LIMIT ' + start + ',' + pageSize
			//var query = 'SELECT `did` FROM `chain_did_property` GROUP BY `did` ORDER BY `block_time` DESC LIMIT ' + start + ',' + pageSize
			conn.query(query, function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send(results);
				}
			})
		})
	}catch(err){
		console.log(err)
	}
});
router.get('/block/dids/count', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		db.getConnection(function(err,conn){
			conn.query('SELECT count(distinct `did` ) AS count FROM `chain_did_property`', function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send(results);
				}
			})
		})
	}catch(err){
		console.log(err)
	}
});
router.get('/block/dids/countWithProperty', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var property = req.query.property;
		db.getConnection(function(err,conn){
			conn.query('SELECT count(distinct `did` ) AS count  FROM `chain_did_property` WHERE `property_key` = "'+property+'"', function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send(results);
				}
			})
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
		db.getConnection(function(err,conn){
			conn.query('SELECT * FROM `chain_did_property` WHERE `did` = "'+did+'" ORDER BY `block_time` LIMIT 1', function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send(results);
				}
			})
		})
	}catch(err){
		console.log(err)
	}
});
router.get('/block/didsWidthProperty', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var property = req.query.property
		var start = req.query.start;
		var pageSize = req.query.pageSize;
		db.getConnection(function(err,conn){
			conn.query('SELECT  distinct did FROM `chain_did_property` WHERE `property_key` = "'+property+'" ORDER BY `block_time` DESC LIMIT ' + start + ',' + pageSize, function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send(results);
				}
			})
		})
	}catch(err){
		console.log(err)
	}
});
router.get('/block/getBalanceFromNodeApi', function(req, res, next) {
	setHeaders(res);
	try{
		var address = req.query.address;
		var path = api_host_node + "/api/1/balance/" + address
		request(path, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    res.send(body);
		  }else{
		  	console.log(error)
		  }
		});
	}catch(err){
		console.log(err)
	}
});
router.get('/block/getAddressInfoFromNodeApi', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var address = req.query.address;
		var start = req.query.start;
		var pageSize = req.query.pageSize;
		var num = (start / pageSize) + 1
		var path = api_host_node + "/api/1/history/" + address+ "?pageSize="+pageSize+"&pageNum="+num
		request(path, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		  	if(typeof body == "string"){
		  		body = JSON.parse(body)
		  	}
		    if(body.status == 200){
		    	res.send(body);
		    }
		  }else{
		  	console.log(error)
		  }
		});
	}catch(err){
		console.log(err)	
	}
})
router.get('/block/getTransactionInfoFromNodeApi', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var txid = req.query.txid;
		var path = api_host_node + "/api/1/tx/" + txid;
		
		request(path, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		  	
		  	if(typeof body == "string"){
		  		body = JSON.parse(body)
		  	}
		    if(body.status == 200){
		    	
		    	res.send(body);
		    }
		  }else{
		  	console.log(error)
		  }
		});
	}catch(err){
		console.log(err)	
	}
})

router.get('/block/getAddressInfo', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var address = req.query.address;
		var start = req.query.start;
		var pageSize = req.query.pageSize;

		db.getConnection(function(err,conn){
			conn.query('SELECT * FROM `chain_block_transaction_history` WHERE `address` = "'+address+'"  ORDER BY `local_system_time` DESC LIMIT ' + start + ',' + pageSize, function (error, results, fields) {
				
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send(results);
					var n = 0;
					results.map((v,k)=>{
						let query= 'SELECT `address`,`value`,`type` FROM `chain_block_transaction_history` WHERE `txid` = "'+v.txid+'"';
						conn.query(query,function (error, results1, fields) {
							if(error){
								console.log("mysql error")
								console.log(error)
							}else{
								n++
								var num = 0;
								var outputs_arr = [];
								var inputs_arr = [];
								results1.map((v1,k1)=>{
									if(v1.type == "income"){
										outputs_arr.push({"address":v1.address,"value":v1.value})	
									}else if(v1.type == "spend"){
										inputs_arr.push({"address":v1.address,"value":v1.value})	
									}
									num++
									if(num === results1.length){
										results[k].outputs_arr = outputs_arr;
										results[k].inputs_arr = inputs_arr;
									}
									if(n===results.length && num === results1.length){
										conn.release();
										res.send(results);
									}
								})
							}
						})
					})
				}
			})
		})
	}catch(err){
		console.log(err)
	}
});
/*router.get('/block/getTransactionsCountFromAddress', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var address = req.query.address;
		
		db.getConnection(function(err,conn){
			conn.query('SELECT count(*) AS count FROM `chain_block_transaction_history` WHERE `address` = "'+address+'"', function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send(results);
				}
			})
		})
	}catch(err){
		console.log(err)
	}
});
*/
router.get('/block/getTransactionsCountFromAddress', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var address = req.query.address;
		var path = api_host_node + "/api/1/history/" + address+ "?pageSize=1&pageNum=1"
		
		request(path, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		  	if(typeof body == "string"){
		  		body = JSON.parse(body)
		  	}
		    if(body.status == 200){
		    	res.send([{"count":body.result.TotalNum}]);
		    }else{
		    	
		    	res.send([{"count":""}]);
		    }
		  }else{
		  	console.log(error)
		  }
		});
	}catch(err){
		console.log(err)
	}
});


router.get('/block/getValueFromAddressAndTxid', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var txid = req.query.txid;
		var address = req.query.address;
		var type = req.query.type;
		db.getConnection(function(err,conn){
			conn.query('SELECT value FROM `chain_block_transaction_history` WHERE `address` = "'+address+'" and `txid`="'+txid+'" and `type`="'+type+'"', function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send(results);
				}
			})
		})
	}catch(err){
		console.log(err)
	}
});

router.get('/block/getReport', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var range = req.query.range;
		var option = {};
		var timestamp = new Date().getTime();
		if(range === "1H"){
			option.rate = 3600;
			option.time = timestamp - option.rate * 1000, "YMDhi";
			
			option.data_count = 60;
			
		}else if (range === "24H"){
			option.rate =  24 * 3600 
			option.time = timestamp - option.rate * 1000,"YMDh";
			
			option.data_count = 24;
			
		}else if(range === "1W"){
			option.rate = 7 * 24 * 3600 
			option.time = timestamp - option.rate * 1000,"YMD";
			
			option.data_count = 7;
			
		}else if(range === "1M"){
			option.rate = 30 * 24 * 3600 
			option.time = timestamp - option.rate * 1000,"YMD";
			
			option.data_count = 30;
		}else if(range === "1Y"){
			option.rate = 12 * 30 * 24 * 3600 
			option.time = timestamp -  option.rate * 1000,"YM";
			
			option.data_count = 12;
		}
		option.timeArr = []
		for(var i = 0 ;i< option.data_count ;i++){
			var t = (timestamp -  (option.data_count - i - 2 ) * option.rate / option.data_count * 1000) /1000
			var t1 = (timestamp -  (option.data_count - i - 1 ) * option.rate / option.data_count * 1000)/1000
			option.timeArr.push({"s":t1,"t":t})
		}
		option.startTime = timestamp -  (option.data_count - 1)  * option.rate / option.data_count * 1000;
				var arr_new = [];
				//var arr_total = [];
				
				option.timeArr.map((v,k)=>{
					db.getConnection(function(err,conn){
						var type = req.query.type;
						if(type === "transactions"){
							type = "txid"
						}
						var query = 'SELECT count(distinct `'+type+'` ) AS count FROM `chain_did_property` WHERE `block_time` < '+v.t+' AND `block_time` >= '+v.s;
						
						if(type === "apps"){
							query ='SELECT count(distinct `info_value` ) AS count FROM `chain_did_app` WHERE `info_type` = "app_name" AND `property_key` LIKE "%AppID" AND `block_time` < '+v.t+' AND `block_time` >= '+v.s
						}
						//console.log(query)
						conn.query(query, function (error, results1, fields) {
							conn.release();
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
				})
		

		
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
			option.time = timestamp - option.rate * 1000, "YMDhi";
			
			option.data_count = 60;
		
		}else if (range === "24H"){
			option.rate =  24 * 3600 
			option.time = timestamp - option.rate * 1000,"YMDh";
			
			option.data_count = 24;
		}else if(range === "1W"){
			option.rate = 7 * 24 * 3600 
			option.time = timestamp - option.rate * 1000,"YMD";
			
			option.data_count = 7;
		}else if(range === "1M"){
			option.rate = 30 * 24 * 3600 
			option.time = timestamp - option.rate * 1000,"YMD";
			
			option.data_count = 30;
		}else if(range === "1Y"){
			option.rate = 12 * 30 * 24 * 3600 
			option.time = timestamp -  option.rate * 1000,"YM";
			
			option.data_count = 12;
		}
		option.startTime = timestamp -  (option.data_count - 1)  * option.rate / option.data_count * 1000 ;
		db.getConnection(function(err,conn){
			var type = req.query.type;
			if(type === "transactions"){
				type = "txid"
			}
			var query = 'SELECT count(distinct `'+type+'` ) AS count FROM `chain_did_property` where `block_time` < '+option.startTime;
			
			if(type === "apps"){
				query ='SELECT count(distinct `info_value` ) AS count FROM `chain_did_app` WHERE `info_type` = "app_name" AND `property_key` LIKE "%AppID" AND `block_time` < '+option.startTime;
			}
			conn.query(query, function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send(results);
				}
			})
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
		db.getConnection(function(err,conn){
			conn.query('SELECT * FROM `chain_did_app` WHERE `info_type` = "app_name" AND `property_key` LIKE "%AppID" GROUP BY `info_value` ORDER BY `block_time` DESC LIMIT ' + start + ',' + pageSize , function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send(results);
				}
			})
		})
	}catch(err){
		console.log(err)
	}
});

router.get('/block/eapps/count', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		db.getConnection(function(err,conn){
			conn.query('SELECT count(distinct `info_value` ) AS count FROM `chain_did_app` WHERE `info_type` = "app_name" AND `property_key` LIKE "%AppID"', function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send(results);
				}
			})
		})
		
	}catch(err){
		console.log(err)
	}
});
router.get('/block/eapp/eapp_id', function(req, res, next) {
	setHeaders(res);
	try{
		var db =  DB.connection;
		var app_name = req.query.app_name;
		db.getConnection(function(err,conn){
			conn.query('SELECT * FROM `chain_did_app` WHERE `info_type` = "app_name" AND `info_value` = "'+ app_name +'" AND `property_key` LIKE "%AppID" ORDER BY `block_time` DESC LIMIT 1' , function (error, results, fields) {
				conn.release();
				if(error){
					console.log("mysql error")
					console.log(error)
				}else{
					res.send(results);
				}
			})
		})
	}catch(err){
		console.log(err)
	}
});
module.exports = router;
