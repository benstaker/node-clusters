var	express		=	require('express')
,	app			=	express();

module.exports = function(cluster){

	var obj = {
		app: app
	,	cluster: cluster
	,	init: function(){
			var that = this;

			that.app.get('/', function(req, res){
				var body = 'Database Service, running on worker: ' + that.cluster.worker.id;
				res.send(body);
			});

			return that.app;

		}
	};

	return obj;
};