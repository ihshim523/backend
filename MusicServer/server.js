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

var db = mongo(global.mongo, ['music'], {authMechanism: 'ScramSHA1'});
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
	
    var obj = JSON.parse(req.body.k);

    var compressed = zlib.deflateSync(buffer);

    try {
        async.waterfall([
        function(cb){
            fs.writeFile('./Music/get.dat', compressed, function(err) {
                cb(null);
            });
        },
        function(cb) {
            var ranking = {rank:[]};

            obj.rank.forEach(function(item){
                if ( item.site === 'melon' )
                    ranking.rank.push(item);
            });

            var compressed = lz.compressToUTF16(JSON.stringify(ranking));
            fs.writeFile('./Music/melon.dat', compressed, function(err) {
                fs.writeFile('./Music/melon5.dat', compressed, function(err) {
                    cb(null);
                });
            });
        },
        function(cb) {
            var ranking = {rank:[]};

            obj.rank.forEach(function(item){
                if ( item.site === 'mnet' )
                    ranking.rank.push(item);
            });

            var compressed = lz.compressToUTF16(JSON.stringify(ranking));
            fs.writeFile('./Music/mnet.dat', compressed, function(err) {
                fs.writeFile('./Music/mnet5.dat', compressed, function(err) {
                    cb(null);
                });
            });
        },
        function(cb) {
            var ranking = {rank:[]};

            obj.rank.forEach(function(item){
                if ( item.site === 'bugs' )
                    ranking.rank.push(item);
            });

            var compressed = lz.compressToUTF16(JSON.stringify(ranking));
            fs.writeFile('./Music/bugs.dat', compressed, function(err) {
                fs.writeFile('./Music/bugs5.dat', compressed, function(err) {
                    cb(null);
                });
            });
        },
        function(cb) {
            var ranking = {rank:[]};

            obj.rank.forEach(function(item){
                if ( item.site === 'soribada' )
                    ranking.rank.push(item);
            });

            var compressed = lz.compressToUTF16(JSON.stringify(ranking));
            fs.writeFile('./Music/soribada.dat', compressed, function(err) {
                fs.writeFile('./Music/soribada5.dat', compressed, function(err) {
                    cb(null);
                });
            });
        },
        function(cb) {
            var ranking = {rank:[]};

            obj.rank.forEach(function(item){
                if ( item.site === 'dosirak' )
                    ranking.rank.push(item);
            });

            var compressed = lz.compressToUTF16(JSON.stringify(ranking));
            fs.writeFile('./Music/dosirak.dat', compressed, function(err) {
                fs.writeFile('./Music/dosirak5.dat', compressed, function(err) {
                    cb(null);
                });
            });
        },
        function(cb) {
            var ranking = {rank:[]};

            obj.rank.forEach(function(item){
                if ( item.site === 'billboard' )
                    ranking.rank.push(item);
            });

            var compressed = lz.compressToUTF16(JSON.stringify(ranking));
            fs.writeFile('./Music/billboard.dat', compressed, function(err) {
                fs.writeFile('./Music/billboard5.dat', compressed, function(err) {
                    cb(null);
                });
            });
        }],
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
