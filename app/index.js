//////////////////////
// MAIN APP SERVICE //
//////////////////////
var	express		=	require('express')
,	app			=	express()
,	request		=	require('request');

module.exports = function(cluster){

	var obj = {
		app: app
	,	cluster: cluster
	,	init: function(){
			var that = this;

			that.app.get('/', function(req, res){
				request('http://localhost:3001' + '/', function (err, resp, body) {
					if(err) console.log(err);
					else if(resp.statusCode == 200) {
						body = JSON.stringify(JSON.parse(body));
						body = body + '<br />App Service, running on worker: ' + that.cluster.worker.id;
						res.send(body);
					}
				});
			});

			return that.app;

		}
	};

	return obj;
};