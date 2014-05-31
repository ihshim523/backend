#!/bin/env node

//var mongo = require('mongojs');

get = function(req, res) {
            res.send("GET:"+req.method);
    
}

post = function(req, res) {
            res.send("POST:"+req.method);
}

var server  = function(req, res, next) {
    switch(req.method) {
        case 'GET':
            get(req,res);
            break;
        case 'POST':
            post(req,res);
            break;
    }
    
    // var db = mongo(connection_string, ['clips']);
    // var clips = db.collection('clips');
// 
//     
    // MongoClient.connect('mongodb://'+connection_string, function(err, db) {
      // if(err) throw err;
      // var collection = db.collection('books').find().limit(10).toArray(function(err, docs) {
        // console.dir(docs);
        // db.close();
      // })
    // })

    next();
}; 

module.exports.server = server;
