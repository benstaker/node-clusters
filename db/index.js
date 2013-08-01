//////////////////////
// DATABASE SERVICE //
//////////////////////
var	express		=	require('express')
,	app			=	express();

app.get('/', function(req, res){
	var body = 'Database Service, running';
	res.send(body);
});

module.exports = app;