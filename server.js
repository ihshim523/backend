#!/bin/env node

var express = require('express');
var fs = require('fs');

var Backend = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */
    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };

    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
        
        process.on('uncaughtException', function(err){
           console.log('Caught:'+err); 
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    // self.createRoutes = function() {
        // self.routes = { };
// 
        // // self.routes['/asciimo'] = function(req, res) {
            // // var link = "http://i.imgur.com/kmbjB.png";
            // // res.send("<html><body><img src='" + link + "'></body></html>");
        // // };
// 
        // self.routes['/'] = function(req, res) {
        	// var 
        	// hostName = req.header('host');
        	// switch(hostName) {
        		// case 'clip.imapp.kr':
        			// break;
//         		
        	// } 
//         	
            // res.setHeader('Content-Type', 'text/html');
            // res.send(self.cache_get('index.html') );
        // };
    // };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {

        self.Hotissue = require('./HotIssueServer/server.js');
        self.clipAnywhere = require('./ClipAnywhereServer/server.js');

        // self.createRoutes();
        self.app = express();
        
//		self.app.use(express.compress());
        self.app.use(express.bodyParser());
	self.app.use(express.methodOverride());
		
        // //  Add handlers for the app (from the routes).
        // for (var r in self.routes) {
            // self.app.get(r, self.routes[r]);
        // }

    try {
        self.app.use(function(req, res, next) {
            //console.log(req.host);
            switch(req.host) {
                case "clip.imapp.kr":
                    //console.log('clip');
                    express.static('./ClipAnywhere')(req,res,next);
                    break;
                case "clip-back.imapp.kr":
                    //console.log('clip-back');
                     self.clipAnywhere.server(req,res,next);
                     break;
                case "hotissue.imapp.kr":
                    express.static('./HotIssue')(req,res,next);
                     break;
//                 case 'localhost':
                 
                case "hotissue-back.imapp.kr":
                     self.Hotissue.server(req,res,next);
                     break;
                default:
                    res.setHeader('Content-Type', 'text/html');
                    res.send(self.cache_get('index.html') );
                    break;
            }  
        });
    }
    catch(err) {
        console.log("## Exception:"+err.message);
    }
            // express.vhost('clip.imapp.kr', express.static('./ClipAnywhere')));

        // self.app.get('/', function(req, res) {
		            // res.setHeader('Content-Type', 'text/html');
            		// res.send(self.cache_get('index.html') );
            		// break;
        // });
    };

    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */

/**
 *  main():  Main code.
 */
var zapp = new Backend();
zapp.initialize();
zapp.start();

