#!/bin/env node

var fs = require('fs');
var zlib = require('zlibjs');
var async = require('async');
var mongo = require('mongojs');
var connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
var db = mongo(connection_string, ['music']);

//////////////////////////////////
var init = function() {
};

var get = function(req, res, next) {
	var music = db.collection('music');
	
	try{
	    music.findOne({k:req.query.k}, function(err, doc) {
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
    var music = db.collection('music');

    var buffer = new Buffer(req.body.k);
	
	//console.log(JSON.stringify(req.body.k) + '###'+buffer.length);
	
    var compressed = zlib.deflateSync(buffer);

    try {
        fs.writeFile('./Music/get.dat', compressed, function(err) {
            res.send('{"R":"1"}');
        });
    }
    catch(e) {
        next();
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
