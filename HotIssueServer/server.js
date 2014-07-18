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
    var hotissue = db.collection('hotissue');
    hotissue.ensureIndex({k:1,expire:1},{expireAfterSeconds:60000});
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
	    	else
	    		next();
	    });
	}
	catch(e) {
		next();
	}

};

var post = function(req, res, next) {
	var client = naver({key: '5b3cf79266a7f34b2d102a8161826d59'});
    var hotissue = db.collection('hotissue');

    var obj = JSON.parse(req.body.k);

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
    		//console.log("BING0:::"+item.title);
    	    client.search(item.title, {target:'news'}, function(error, response, data) {
    	    	if (!error) {
    	    		//console.log("BING4:::" + JSON.stringify(data));
    	    		cb2(null, data);
    	    	}
    	    	else {
    	    		//console.log("BING1:::"+error);
    	    		cb2(true);
    	    	}
    	    });
    	},
    	function(data, cb2){
    		//console.log("BING2:::");//+JSON.stringify(data));
    		if ( data && data.rss && data.rss.channel && data.rss.channel.length > 0 && 
    				data.rss.channel[0].item && data.rss.channel[0].item.length > 0 &&
    				data.rss.channel[0].item[0].description && data.rss.channel[0].item[0].description.length > 0 ) {
    			
    			var text = htmlToText.fromString(data.rss.channel[0].item[0].description[0], {
    			    wordwrap: 130
    			});

	    		//console.log("BING3:: "+item.title+" :::"+text);

		        hotissue.update({k:item.title},{k:item.title,v:text,
		        	expire:new Date()}, {upsert:true}, function(err, saved) { //
		        		//if ( err ) console.log(err);
		        		cb2();
			       	});
    		}
    		else
    			cb2();
    	}
    	],
    	function(err){
      		//console.log('#### next');
    		
    		cb();
    	}
    	);
    },
    function(err){
  		//console.log('#### series end');
    	
        var buffer = new Buffer(req.body.k);
        var compressed = zlib.deflateSync(buffer);

        try {
            fs.writeFile('./HotIssue/get.dat', compressed, function(err) {
                var buffer = new Buffer(req.body.e, 'base64');
                fs.writeFile('./HotIssue/get2.dat', buffer, function(err) {
                    res.send('{"R":"1"}');
                });
            });
        }
        catch(e) {
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
