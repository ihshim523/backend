#!/bin/env node

var fs = require('fs');
var zlib = require('zlibjs');
var async = require('async');
var lz = require('lz-string');

// var connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
//   process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
//   process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
//   process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
//   process.env.OPENSHIFT_APP_NAME;

var db = require('../elastic.js');
//////////////////////////////////

var get = function(req, res, next) {
	res.end();
};

function makeFile(input, obj, cb2){
	zlib.deflate(input, function(err, compressed){
		try {
			fs.writeFile('./Voa/get.dat', compressed, function(err) {
				cb2(null);
			});
		}
		catch(e) {
			console.log(JSON.stringify(e));
			cb2(true);
		}
	});
};

var post = function(req, res, next) {
	res.end();
};

var del = function(req, res, next) {
    res.end();
};

function list(cb) {
	db.get({index:'esl', type:'voa', id:'all'}, function(err, doc){
		if (!err && doc.found){
			var obj = doc._source;
			var input = new Buffer(obj);
			makeFile(input, obj, function(err){
				cb(null);
			});
		}
	});
}

var init = function(cb) {
	setInterval(function(){
    list(function(){});
  },60000);

	list(cb);
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
