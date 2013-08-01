module.exports = function(cluster){

	var config = {
		services: [
			{
				service: require('./log/')(cluster)
			}
		,	{
				service: require('./db/')(cluster)
			}
		,	{
				service: require('./api/')(cluster)
			,	port: 3001
			}
		,	{
				service: require('./app/')(cluster)
			,	port: 3000
			}
		]
	};

	return config;
};