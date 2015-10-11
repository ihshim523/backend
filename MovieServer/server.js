#!/bin/env node

var fs = require('fs');
var zlib = require('zlibjs');
var async = require('async');
var lz = require('lz-string');
var gcm = require('./sendGCM.js');

// var connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
//   process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
//   process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
//   process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
//   process.env.OPENSHIFT_APP_NAME;

var db;
//////////////////////////////////
var init = function(elasticsearch) {
	db = elasticsearch;
};

var get = function(req, res, next) {
	try{
	    db.get({index:'hotissue', type:'movie', id:1}, function(err, doc) {
	    	if (!err && doc.found) {
	    		//console.log("DOC:::"+JSON.stringify(doc));
	    	    var input = new Buffer(JSON.stringify(doc._source));
	    	    zlib.deflate(input, function(err, compressed){
			    	  if (!err) res.send(compressed);
							else next();
						});
	    	}
	    	else
	    		next();
	    });
	}
	catch(e) {
		next();
	}
};

var list = function(req, res, next) {
	try{
	    db.get({index:'hotissue', type:'movie', id:1}, function(err, doc) {
	    	if (!err && doc.found) {
	    		//console.log("DOC:::"+JSON.stringify(doc));
	    	    var input = new Buffer(JSON.stringify(doc._source));
	    	    var compressed = lz.compressToUTF16(input);
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
                db.index({index:'hotissue','type':'movie',id:1,body:req.body.k}, function(err) {
                    cb(null);
                });
            }],
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
module.exports.list = list;
