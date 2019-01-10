'use strict'
var mysql = require('mysql');
var config = require("./config");
class DB{
	constructor(){
		this.option = {
		  host     : config.host,
		  user     : config.user,
		  password : config.password,
		  database : config.database
		};
	}
	connect(){
		var self = this;
		var connection = mysql.createConnection(this.option);
		connection.connect(function(e){
			console.log("connecting mysql")
		});
		connection.on("error",function(e){
			if (e.code === 'PROTOCOL_CONNECTION_LOST') {
				self.connect();
	        } else {
	            throw e;
	        }
		})
		this.connection = connection
	}
}
module.exports = DB;