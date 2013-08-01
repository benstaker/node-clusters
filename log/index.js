/////////////////
// LOG SERVICE //
/////////////////
var	express		=	require('express')
,	app			=	express();

app.get('/', function(req, res){
	var body = 'Log Service, running';
	res.send(body);
});

module.exports = app;