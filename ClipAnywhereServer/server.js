#!/bin/env node

//var mongo = require('mongojs');

var server  = function(req, res, next) {
    
    res.send(req.method);
    
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
