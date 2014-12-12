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
var db = mongo(connection_string, ['hotissue']);
var naver = require('imnaver');
var htmlToText = require('html-to-text');

//////////////////////////////////
var init = function() {
//    var hotissue = db.collection('hotissue');
//    hotissue.ensureIndex({expire:1},{expireAfterSeconds:6000});
    
    setInterval(function(){
        var hotissue = db.collection('hotissue');
    	hotissue.remove({expire:{$lt:((new Date).getTime() - 24*60*60*1000) }});
    },60000);
}

var get = function(req, res, next) {
	var hotissue = db.collection('hotissue');
	
	try{
	    hotissue.findOne({k:req.query.k}, function(err, doc) {
	    	if (!err) {
	    		//console.log("DOC:::"+JSON.stringify(doc));

	    	    var buffer = new Buffer(JSON.stringify(doc));
	    	    var compressed = zlib.deflateSync(buffer);
	    	    res.send(compressed);
	    	}
	    	else {
                console.log('get1:'+err);
	    		next();
            }
	    });
	}
	catch(e) {
        console.log('get2:'+e);
		next();
	}

};

var post = function(req, res, next) {
	var client = naver({key: '1e7189070640781bb5e7fae3c7f88904'});
    var hotissue = db.collection('hotissue');

// console.log('#####'+JSON.stringify(req.body)+'#####');

//    var obj = JSON.parse(req.body.k);
    var obj = req.body.k;

    //console.log('#### series begin');
    
    async.eachSeries(obj.rank, function(item, cb){
    	async.waterfall([function(cb2){
            hotissue.findOne({k:item.title}, function(err, doc) {
            	if (err) {
      		//console.log('#### error found');
            		cb2();
            	}
            	else 
            	if ( !doc ) {
              		//console.log('#### not found');
            		cb2();
            	}
            	else
            		cb2(true);
            });
    	},
    	function(cb2){
    		console.log("BING0:::"+item.title);
    	    client.search(item.title, {target:'news'}, function(error, response, data) {
                if ( !data.error ) {
    	    		console.log("BING4:::" + JSON.stringify(data));
    	    		cb2(null, data);
    	    	}
    	    	else {
    	    		console.log("BING1:::"+error);
    	    		cb2(true);
    	    	}
    	    });
    	},
    	function(data, cb2){
    		console.log("BING2:::");//+JSON.stringify(data));
    		if ( data && data.rss && data.rss.channel && data.rss.channel.length > 0 && 
    				data.rss.channel[0].item && data.rss.channel[0].item.length > 0 &&
    				data.rss.channel[0].item[0].description && data.rss.channel[0].item[0].description.length > 0 ) {
    			
    			var text = htmlToText.fromString(data.rss.channel[0].item[0].description[0], {
    			    wordwrap: 130
    			});

	    		console.log("BING3:: "+item.title+" :::"+text);

		        hotissue.update({k:item.title},{k:item.title,v:text,
		        	expire:(new Date).getTime()}, {upsert:true}, function(err, saved) { //
		        		//if ( err ) console.log(err);
		        		cb2();
			       	});
    		}
    		else
    			cb2();
    	}
    	],
    	function(err){

            // hotissue.update({k:item.title},{k:item.title,v:text,
            //     expire:(new Date).getTime()}, {upsert:true}, function(err, saved) { //
            //         //if ( err ) console.log(err);
            //         cb2();
            //     });
    		
    		cb();
    	}
    	);
    },
    function(err){
  		console.log('#### series end');
        try {	
            var buffer = new Buffer(JSON.stringify(req.body.k));
            var compressed = zlib.deflateSync(buffer);

            console.log('#### series end 1');

            fs.writeFile('./HotIssue/get.dat', compressed, function(err) {
                console.log('#### series end 2:'+err);
                // var buffer = new Buffer(req.body.e, 'base64');
                // fs.writeFile('./HotIssue/get2.dat', buffer, function(err) {
                //     res.send('{"R":"1"}');
                // });
                res.send('{"R":"1"}');
            });
        }
        catch(e) {
            console.log('#### series ex:' + e);
            next();
        }
    });
    
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
