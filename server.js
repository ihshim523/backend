#!/bin/env node

var express = require('express');
var fs = require('fs');
var url = require("url");
var path = require("path");
var async = require('async');

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
        }

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


    self.allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

        next();
    };

    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {

      var hotissue = require('./HotIssueServer/server.js');
      var clipAnywhere = require('./ClipAnywhereServer/server.js');
      var music = require('./MusicServer/server.js');
      var video = require('./VideoServer/server.js');
      var movie = require('./MovieServer/server.js');
      var voa = require('./VoaServer/server.js');

      async.waterfall([
        function(cb){
          hotissue.init(cb);
        },
        function(cb){
          clipAnywhere.init(cb);
        },
        function(cb){
          movie.init(cb);
        },
        function(cb){
          music.init(cb);
        },
        function(cb){
          video.init(cb);
        },
        function(cb){
          voa.init(cb);
        }],
        function(err){
          // self.createRoutes();
          self.app = express();

          //    self.app.use(express.compress());
          self.app.use(express.bodyParser());
          self.app.use(express.methodOverride());
          self.app.use(self.allowCrossDomain);

          // //  Add handlers for the app (from the routes).
          // for (var r in self.routes) {
          // self.app.get(r, self.routes[r]);
          // }

          try {
            self.app.use(function(req, res, next) {
              switch(req.host) {
                case "clip.imapp.kr":
                case "test-clip.imapp.kr":
                  //console.log('clip');
                  express.static('./ClipAnywhere')(req,res,next);
                  break;
                case "clip-back.imapp.kr":
                case "test-clip-back.imapp.kr":
                  //console.log('clip-back');
                  clipAnywhere.server(req,res,next);
                  break;
                case "hotissue.imapp.kr":
                case "test-hotissue.imapp.kr":
                  express.static('./HotIssue')(req,res,next);
                  break;
                case "hotissue-back.imapp.kr":
                case "test-hotissue-back.imapp.kr":
                  hotissue.server(req,res,next);
                  break;
                case "appicons.imapp.kr":
                case "test-appicons.imapp.kr":
                  express.static('./AppIcons')(req,res,next);
                  break;
                case "test-ruler.imapp.kr":
                case "ruler.imapp.kr":
                  express.static('./IMRuler')(req,res,next);
                  break;
                case "music.imapp.kr":
                case "test-music.imapp.kr":
                  express.static('./Music')(req,res,next);
                  break;
                case "music-back.imapp.kr":
                case "test-music-back.imapp.kr":
                  music.server(req,res,next);
                  break;
                case "video.imapp.kr":
                case "test-video.imapp.kr":
                  express.static('./Video')(req,res,next);
                  break;
                case "video-back.imapp.kr":
                case "test-video-back.imapp.kr":
                  video.server(req,res,next);
                  break;
                case "movie.imapp.kr":
                case "test-movie.imapp.kr":
                  express.static('./Movie')(req,res,next);
                  break;
                case "movie-back.imapp.kr":
                case "test-movie-back.imapp.kr":
                  movie.server(req,res,next);
                  break;
                case "c6.imapp.kr":
                case "voa.imapp.kr":
                case "test-voa.imapp.kr":
                  express.static('./Voa')(req,res,next);
                  break;
                case "voa-back.imapp.kr":
                case "test-voa-back.imapp.kr":
                  voa.server(req,res,next);
                  break;
                default:
                  res.setHeader('Content-Type', 'text/html');
                  res.send(self.cache_get('index.html') );
                  break;
              }
            });
            self.app.listen(self.port, self.ipaddress, function() {
              console.log('%s: Node server started on %s:%d ...',
                    Date(Date.now() ), self.ipaddress, self.port);
            });
          }
          catch(err) {
              console.log("## Exception:"+err.message);
          }
        }
      );
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
};   /*  Sample Application.  */

/**
 *  main():  Main code.
 */
var zapp = new Backend();
zapp.initialize();
