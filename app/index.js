//////////////////////
// MAIN APP SERVICE //
//////////////////////
var	express		=	require('express')
,	app			=	express()
,	request		=	require('request');

app.get('/', function(req, res){
	request('http://localhost:3001' + '/', function (err, resp, body) {
		if(err) console.log(err);
		else if(resp.statusCode == 200) {
			body = JSON.stringify(JSON.parse(body));
			res.send(body);
		}
	});
});

module.exports = app;