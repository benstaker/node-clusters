module.exports = function(cluster){

	var config = {
		services: [
			{
				path: './log/'
			}
		,	{
				path: './db/'
			}
		,	{
				path: './api/'
			,	port: 3001
			}
		,	{
				path: './app/'
			,	port: 3000
			}
		]
	};

	return config;
};