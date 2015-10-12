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
	    db.get({index:'hotissue', type:'temp_movie', id:'movie'}, function(err, doc) {
	    	if (!err && doc.found) {
	    		//console.log("DOC:::"+JSON.stringify(doc));
	    	    var input = new Buffer(JSON.stringify(doc._source));
	    	    zlib.deflate(input, function(err, compressed){
			    	  if (!err) res.send(compressed);
							else res.end();
						});
	    	}
	    	else
	    		res.end();
	    });
	}
	catch(e) {
		res.end();
	}
};

var list = function(req, res, next) {
	try{
		db.get({index:'hotissue', type:'temp_movie', id:'movie'}, function(err, doc) {
    	if (!err && doc.found) {
  	    var compressed = lz.compressToUTF16(JSON.stringify(doc._source));
				res.send(compressed);
    	}
    	else
    		res.end();
    });
	}
	catch(e) {
		console.log("list:::"+JSON.stringify(e));
		res.end();
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
    }
};

var del = function(req, res, next) {
    res.end();
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
