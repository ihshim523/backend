#!/bin/env node

var fs = require('fs');
var zlib = require('zlibjs');
var async = require('async');
var mongo = require('mongojs');
var lz = require('lz-string');

// var connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
//   process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
//   process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
//   process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
//   process.env.OPENSHIFT_APP_NAME;
  
var db = mongo(global.mongo, ['video'], {authMechanism: 'ScramSHA1'});
//////////////////////////////////
var init = function() {
};

var get = function(req, res, next) {
	var video = db.collection('video');
	
	try{
	    video.findOne({k:req.query.k}, function(err, doc) {
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
    var video = db.collection('video');

    var buffer = new Buffer(req.body.k);
	
    var obj = JSON.parse(req.body.k);

    var compressed = zlib.deflateSync(buffer);

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
