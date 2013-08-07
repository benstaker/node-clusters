module.exports = function(cluster){

	var config = {
		/**
		* This is where you define the services you'd like to run.
		* @property	{String}	(required) Path to the service
		* @property	{Int}		(optional) Port number to run off
		*/
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