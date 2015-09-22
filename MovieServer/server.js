#!/bin/env node

var fs = require('fs');
var zlib = require('zlibjs');
var async = require('async');
var mongo = require('mongojs');
var lz = require('lz-string');
var gcm = require('./sendGCM.js');

// var connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
//   process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
//   process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
//   process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
//   process.env.OPENSHIFT_APP_NAME;
var connection_string = "admin" + ":" +
  "B61vbEbF3kAg" + "@" +
  "mongo.imapp.kr" + ':' +
  "51553" + '/backend';
  
var db = mongo(connection_string, ['movie']);
//////////////////////////////////
var init = function() {
};

var get = function(req, res, next) {
	var movie = db.collection('movie');
	
	try{
	    movie.findOne({k:req.query.k}, function(err, doc) {
	    	if (!err) {
	    		//console.log("DOC:::"+JSON.stringify(doc));

	    	    var buffer = new Buffer(JSON.stringify(doc));
	    	    var compressed = zlib.deflateSync(buffer);
	    	    res.send(compressed);
	    	}
	    	else
	    		next();
	    });
	}
	catch(e) {
		next();
	}

};

var post = function(req, res, next) {
    var movie = db.collection('movie');

    // if ( req.body.f == 1 ) {
    //     gcm.registerId(req.body.i); 
    // }
    // else
    if ( req.body.f == 2 ) {
        gcm.send(new Buffer('{notify_category:' + req.body.c + '}').toString('base64'), next);
    }
    else {
        try {
            async.waterfall([
            function(cb){

                var compressed = lz.compressToUTF16(req.body.k);
                fs.writeFile('./Movie/get.dat', compressed, function(err) {
                    cb(null);
                });
            }
            ],
            function(err) {
                 res.send('{"R":"1"}');
            });
        }
        catch(e) {
            next();
        }
    }
};

var del = function(req, res, next) {
    next();
};

var server  = function(req, res, next) {
    switch(req.method) {
        case 'GET':
            get(req,res,next);
            break;
        case 'POST':
            post(req,res,next);
            break;
        case 'DELETE':
            del(req,res,next);
            break;
    }
}; 

module.exports.init = init;
module.exports.server = server;
