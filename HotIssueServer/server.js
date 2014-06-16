#!/bin/env node

var mongo = require('mongojs');
var connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;

var db = mongo(connection_string, ['clips']);
var fs = require('fs');
var lz4 = require('lz4');
var encoder = lz4.createEncoderStream();

get = function(req, res, next) {
    var clips = db.collection('clips');

    console.log("k="+req.query.k);

    id = parseInt(req.query.k);
    
    clips.findOne({k:id}, function(err, doc) {
        
        console.log("err:"+err);
        
        if ( !err ) {
            if ( !doc ) 
                res.jsonp({v:null});
            else
                res.jsonp({k:doc.k,v:doc.v});
                
            console.log("ret:" + JSON.stringify(doc));
        }
        else
            res.jsonp(err);
    });
}

post = function(req, res, next) {

    var clips = db.collection('hotissue');
    
    id = parseInt(req.query.k);
    
    // clips.update({k:id},{ $setOnInsert:{k:id,v:req.body.v} }, {upsert:true},
     // function(err, saved) { //
           // if ( saved && saved.updatedExisting ) 
                // res.send({u:true});
            // else               
           // if ( saved && !saved.updatedExisting ) 
                // res.send({u:false});
            // else
                // next();
//                 
           // console.log("err:"+err);
           // console.log("saved:"+JSON.stringify(saved));
     // });
     
     clips.ensureIndex({expire:1},{expireAfterSeconds:600});
     
    clips.update({k:id},{k:id,v:req.query.v,expire:new Date()}, {upsert:true},
     function(err, saved) { //
           if ( saved && saved.updatedExisting ) 
                res.jsonp({u:true});
            else               
           if ( saved && !saved.updatedExisting ) 
                res.jsonp({u:false});
            else
                next();

           console.log("err:"+err);
           console.log("saved:"+JSON.stringify(saved));
     });

//    res.send('good:'+req.body.k + ',v:'+req.body.v);
}

del = function(req, res, next) {
    console.log('delete verb');
    
    var clips = db.collection('clips');
    
    clips.remove({});
    
    next();
}

var server  = function(req, res, next) {
    switch(req.method) {
        case 'GET':
            switch(req.query.f) {
                case '1':
                    get(req,res, next);
                break;
                case '2':
                    post(req,res, next);
                break;
            }
            break;
        case 'POST':
            break;
        case 'DELETE':
            del(req,res,next);
            break;
    }
}; 

module.exports.server = server;
