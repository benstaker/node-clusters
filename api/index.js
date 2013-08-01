/////////////////
// API SERVICE //
/////////////////
var	express		=	require('express')
,	app			=	express();

app.get('/', function(req, res){
	res.json(200, {message: 'success'});
});

module.exports = app;