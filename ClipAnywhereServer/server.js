#!/bin/env node

var mongo = require('mongojs');
var connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;

get = function(req, res, next) {
    var db = mongo(connection_string, ['clips']);
    var clips = db.collection('clips');
    
    clips.find({k:req.query.k}, function(err, docs) {
        if ( !err && docs.length > 0 ) {
            res.send(docs);
            //res.send(docs[0].value);
        }
        else
            next();
    });
}

post = function(req, res, next) {
    var db = mongo(connection_string, ['clips']);
    var clips = db.collection('clips');
    
    clips.update({k:req.body.k},{ $setOnInsert:{k:req.body.k,v:req.body.v} }, {upsert:true},
     function(err, saved) { // 
           if( err || !saved ) {
               res.send( err + ":User not saved");
           }
           else
                res.send(saved.v);               

     });
    
//    res.send('good:'+req.body.k + ',v:'+req.body.v);
}

var server  = function(req, res, next) {
    switch(req.method) {
        case 'GET':
            get(req,res, next);
            break;
        case 'POST':
            post(req,res, next);
            break;
    }
}; 

module.exports.server = server;
