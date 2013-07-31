var cluster		=	require('cluster')
,	os			=	require('os');

/**
* Services
*/
var	appServer	=	require('./app/')(cluster)
,	appPort		=	3000
,	apiServer	=	require('./api/')(cluster)
,	apiPort		=	appPort + 1
,	dbServer	=	require('./db/')(cluster)
,	dbPort		=	appPort + 2
,	logServer	=	require('./log/')(cluster)
,	logPort		=	appPort + 3;

var Server = {
	name: 'Server'
,	cpus: 1
,	autoRestart: true
,	start: function(autoRestart, cpus){
		var that = this;

		that.autoRestart = (typeof autoRestart !== 'undefined') ? autoRestart : true;

		/**
		* Amount of CPUs we are utilising
		*/
		that.cpus = (typeof cpus !== 'undefined') ? parseInt(cpus) : os.cpus().length;

		/**
		* Make sure we don't fork more processes than CPUs
		*/
		if(os.cpus().length < that.cpus) that.cpus = os.cpus().length;

		/**
		* Create child processes if we are the master process
		*/
		if(cluster.isMaster){
			/**
			* Fork the child processes
			*/
			for (var i = 0; i < that.cpus; i++) cluster.fork();

			/**
			* Event Listeners
			*/
			cluster.on('listening', function(worker, address){
				console.log('[LISTENING] Worker #' + worker.process.pid + ' is now connected to ' + address.address + ':' + address.port);
			});
			cluster.on('exit', function(worker, code, signal){
				if(that.autoRestart){
					console.log('[EXIT] Worker #' + worker.process.pid + ' has died, restarting...');
					cluster.fork();
				}
			});
		} else {
			function startServer(workerID){
				switch(workerID){
					/**
					* Logging
					*/
					case 1:
						logServer.init().listen(logPort);
						break;
					/**
					* Database
					*/
					case 2:
						dbServer.init().listen(dbPort);
						break;
					/**
					* API
					*/
					case 3:
						apiServer.init().listen(apiPort);
						break;
					/**
					* Main App
					*/
					case 4:
						appServer.init().listen(appPort);
						break;
				}
			};
			
			/**
			* Quad Core OR Dual Core + Hyper Threading
			*/
			if(that.cpus === 4){
				startServer(cluster.worker.id);
			}
			/**
			* Dual Core OR Single Core + Hyper Threading
			*/
			else if(that.cpus === 2){
				if(cluster.worker.id === 1){
					startServer(1);
					startServer(2);
				} else if(cluster.worker.id === 2) {
					startServer(3);
					startServer(4);
				}
			}
			/**
			* Single Core
			*/
			else if(that.cpus === 1) {
				startServer(1);
				startServer(2);
				startServer(3);
				startServer(4);
			}
			/**
			* Un-supported CPUs
			*/
			else {
				console.error('Sorry, we do not support your CPU.');
			}	
		}
	}
};

Server.start();