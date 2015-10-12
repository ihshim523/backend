#!/bin/env node

var fs = require('fs');
var zlib = require('zlibjs');
var async = require('async');
// var connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
//   process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
//   process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
//   process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
//   process.env.OPENSHIFT_APP_NAME;

var db = require('../elastic.js');
var naver = require('imnaver');
var htmlToText = require('html-to-text');
var lz = require('lz-string');

var get = function(req, res, next) {

	try{
    db.get({
		index:'hotissue',
		type:'hotissue_article',
		id:req.query.k}, function(err, doc) {
        // console.log("err:"+err);
        if ( !err && doc.found ) {
          var input = new Buffer(JSON.stringify(doc._source));
          zlib.deflate(input, function(err, compressed) {
	          if (!err)
	            res.send(compressed);
	          else
	            res.end();
	          //  console.log("ret:" + JSON.stringify(doc));
					});
				}
        else {
          console.log('get1:'+err);
          res.end();
        }
    });
	}
	catch(e) {
        console.log('get2:'+e);
		res.end();
	}

};

var post = function(req, res, next) {
	var client = naver({key: '1e7189070640781bb5e7fae3c7f88904'});
// console.log('#####'+JSON.stringify(req.body)+'#####');
//    var obj = JSON.parse(req.body.k);
  var obj = req.body.k;
    //console.log('#### series begin');
  async.eachSeries(obj.rank, function(item, cb){
  	async.waterfall([function(cb2){
      db.get({
  		index:'hotissue',
  		type:'hotissue_article',
  		id:item.title}, function(err, doc) {
          // console.log("err:"+err);
          if ( !err && doc.found ) {
          		cb2(true);
          }
          else {
            cb2();
          }
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

        db.index({
      		index:'hotissue',
      		type:'hotissue_article',
      		id:item.title,
      		body:{k:item.title,v:text,expire:(new Date()).getTime()}
      	}, function(err, response) { //
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
  	});
  },
  function(err) {
		console.log('#### series end');

		db.index({
			index:'hotissue',
			type:'hotissue_list',
			id:'1',
			body:{v:req.body.k}
		},
		function(err, saved) { //
		//if ( err ) console.log(err);
			res.send('{"R":"1"}');
		});
	});

/*             fs.writeFile('./HotIssue/get.dat', compressed, function(err) {
                console.log('#### series end 2:'+err);

                var compressed = lz.compressToUTF16(JSON.stringify(req.body.k));

                fs.writeFile('./HotIssue/get2.dat', compressed, function(err) {
                     res.send('{"R":"1"}');
                });
//                res.send('{"R":"1"}');
            }); */
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

var list = function(cb) {
  try{
    db.get({index:'hotissue',type:'hotissue_list',id:'1'}, function(err, doc) {
      if (!err && doc.found) {
        //console.log("DOC:::"+JSON.stringify(doc));
        var input = new Buffer(JSON.stringify(doc._source.v));
        zlib.deflate(input, function(err, compressed){
          fs.writeFile('./HotIssue/get.dat', compressed, function(err) {
            var compressed = lz.compressToUTF16(JSON.stringify(doc._source.v));
            fs.writeFile('./HotIssue/get2.dat', compressed, function(err) {
              cb(null);
            });
            //                res.send('{"R":"1"}');
          });
        });
      }
      else {
        console.log('get1:'+err);
        cb(null);
      }
    });
  }
  catch(e) {
    console.log('get2:'+e);
    cb(null);
  }
};

//////////////////////////////////
var init = function(cb) {
  setInterval(function(){
    db.deleteByQuery({
      index:'hotissue',
      type:'hotissue_article',
      body:{
        "range" : {
          "expire":{
            "lte":(new Date()).getTime() - 24*60*60*1000
          }
        }
      }
    });
    list(function(){});
  },60000);

  list(cb);
};

module.exports.init = init;
module.exports.server = server;
