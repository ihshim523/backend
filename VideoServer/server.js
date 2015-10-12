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
		async.waterfall([
		function(cb){
			fs.writeFile('./Video/get.dat', compressed, function(err) {
				cb(null);
			});
		},
		function(cb) {
			var ranking = {rank:[]};

			obj.rank.forEach(function(item){
				if ( item.site === 'nate' )
					ranking.rank.push(item);
			});

			var compressed = lz.compressToUTF16(JSON.stringify(ranking));
			fs.writeFile('./Video/v1.dat', compressed, function(err) {
				cb(null);
			});
		},
		function(cb) {
			var ranking = {rank:[]};

			obj.rank.forEach(function(item){
				if ( item.site === 'youtube' )
					ranking.rank.push(item);
			});

			var compressed = lz.compressToUTF16(JSON.stringify(ranking));
			fs.writeFile('./Video/v2.dat', compressed, function(err) {
				cb(null);
			});
		},
		function(cb) {
			var ranking = {rank:[]};

			obj.rank.forEach(function(item){
				if ( item.site === 'pandora' )
					ranking.rank.push(item);
			});

			var compressed = lz.compressToUTF16(JSON.stringify(ranking));
			fs.writeFile('./Video/v3.dat', compressed, function(err) {
				cb(null);
			});
		},
		function(cb) {
			var ranking = {rank:[]};

			obj.rank.forEach(function(item){
				if ( item.site === 'mgoon' )
					ranking.rank.push(item);
			});

			var compressed = lz.compressToUTF16(JSON.stringify(ranking));
			fs.writeFile('./Video/v4.dat', compressed, function(err) {
					cb(null);
			});
		},
		function(cb) {
			var ranking = {rank:[]};

			obj.rank.forEach(function(item){
				if ( item.site === 'afreeca' )
					ranking.rank.push(item);
			});

			var compressed = lz.compressToUTF16(JSON.stringify(ranking));
			fs.writeFile('./Video/v5.dat', compressed, function(err) {
				cb(null);
			});
		}
		],
		function(err) {
			 cb(null);
		});
	}
	catch(e) {
		console.log(JSON.stringify(e));
		cb(true);
	}
}

var post = function(req, res, next) {
    var input = new Buffer(req.body.k);
    var obj = JSON.parse(req.body.k);

		makeFile(input, obj, function(err){
			if (!err)
				res.send('{"R":"1"}');
			res.end();

			db.index({index:'hotissue', type:'temp_video', id:'all', body:req.body.k}, function(err){
			});
		})
};

var del = function(req, res, next) {
    res.end();
};

function list(cb) {
	db.get({index:'hotissue', type:'temp_video', id:'all'}, function(err, doc){
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
