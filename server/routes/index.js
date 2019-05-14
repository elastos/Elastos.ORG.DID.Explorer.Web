var apiv1 =require('./api') 
var api_v2 =require('./api_v2') 

module.exports = function(app){
	app.use('/api/v1', apiv1);
	app.use('/api/v2', api_v2);
};