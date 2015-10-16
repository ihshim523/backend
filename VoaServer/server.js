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
var gcm = require('./sendGCM.js');
//////////////////////////////////

var get = function(req, res, next) {
	res.end();
};

function makeFile(input, cb2){
	var compressed = lz.compressToUTF16(JSON.stringify(input));
	fs.writeFileSync('./Voa/voa/get.dat', compressed);
	cb2(null);
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
			makeFile(doc._source, function(err){
				db.get({index:'esl', type:'voa', id:'push'}, function(err, doc){
					if (!err && doc.found){
						if (doc._source.push) {
							db.index({index:'esl', type:'voa', id:'push', body:{push:false}}, function(err, response){
								gcm.send('', cb);
							});
						}
						else
							cb(null);
					}
					else
						cb(null);
				});
			});
		}
		else {
			console.log('not found:::'+JSON.stringify(err));
			cb(true);
		}
	});
}

var init = function(cb) {
	console.log('+voa init');
	setInterval(function(){
    list(function(){});
  },60000);

	list(cb);
	console.log('-voa init');
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
