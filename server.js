var cluster		=	require('cluster')
,	os			=	require('os')
,	config		=	require('./config')(cluster)
,	services	=	config.services;

/**
* Set the default values
*/
var coreServices = process.env.coreServices || [];
var currentService = process.env.currentService || 0;

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
			console.log('Starting ' + that.name + '...');

			/**
			* Assign services to each of the cores
			*/
			var servicesPerCore = Math.floor(services.length / that.cpus);
			for (var i = 0; i < that.cpus; i++) coreServices.push(servicesPerCore);
			extraServices = services.length % that.cpus;
			for (var i = 0; i < extraServices; i++) coreServices[i]++;

			/**
			* Environment variables to pass to each child process.
			* Here we define how many services per core will be
			* executed, as well as the current service.
			*/
			var envVars = {};
			envVars['coreServices'] = coreServices;
			envVars['currentService'] = currentService;

			/**
			* Fork a process for each core
			*/
			for (var i = 0; i < that.cpus; i++){
				envVars['currentService'] = envVars['currentService'] + coreServices[i];
				cluster.fork(envVars);
			}

			/**
			* Event Listeners
			*/
			cluster.on('listening', function(worker, address){
				//console.log('[LISTENING] Worker #' + worker.process.pid + ' is now connected to ' + address.address + ':' + address.port);
			});
			cluster.on('exit', function(worker, code, signal){
				/**
				* Auto-restarts the worker if we have enabled this
				*/
				if(that.autoRestart){
					console.log('[EXIT] Worker #' + worker.process.pid + ' has died, restarting...');
					cluster.fork(envVars);
				}
			});
		} else {

			function startServer(){
				currentService--;

				console.log('Starting process #' + currentService);

				/**
				* Services that require a server to be created.
				*/
				if(typeof services[currentService].port !== 'undefined'){
					var app = require(services[currentService].path);
					app.listen(services[currentService].port);
				}
				/**
				* Other services
				*/
				else {
					var app = require(services[currentService].path);
				}				
			};

			/**
			* If a service can be allocated to a single core
			*/
			if(coreServices[0] == 1) {
				startServer();
			} else {
				/**
				* Start each service, allocating it to the correct core
				*/
				for (var i = 0; i < coreServices[cluster.worker.id-1]; i++) {
					startServer();
				};
			}
		}
	}
};

/**
* Start the cluster server
*/
Server.start(false);