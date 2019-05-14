var http     = require('http');
var schedule = require("node-schedule");
var DB = new (require('../db'));
DB.connect();
module.exports = function(){

	var db =  DB.connection;
	hasBlocksListTable(db)
	var rule1     = new schedule.RecurrenceRule();
	var times1    = [1,6,11,16,21,26,31,36,41,46,51,56];
	rule1.second  = times1;
	schedule.scheduleJob(rule1, function(){
	 
	})
}

const hasBlocksListTable = (db)=>{
	db.query("show tables like ''", function (error, results, fields) {
			if(error){
				console.log("mysql error")
				console.log(error)
				//db = DB.connect();
			}else{
				res.send(results);
			}
		})
	
}

