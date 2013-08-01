/////////////////
// API SERVICE //
/////////////////
var	express		=	require('express')
,	app			=	express();

module.exports = function(cluster){

	var obj = {
		app: app
	,	cluster: cluster
	,	init: function(){
			var that = this;

			that.app.get('/', function(req, res){
				res.json(200, {message: 'success'});
			});

			return that.app;

		}
	};

	return obj;
};