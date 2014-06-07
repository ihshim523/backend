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

    console.log("k="+req.query.k);

    id = parseInt(req.query.k);
    
    clips.findOne({k:id}, function(err, doc) {
        
        console.log("err:"+err);
        
        if ( !err ) {
            if ( !doc ) 
                res.send({v:null});
            else
                res.send({k:doc.k,v:doc.v});
                
            console.log("ret:" + JSON.stringify(doc));
        }
        else
            res.send(err);
    });
}

post = function(req, res, next) {
    console.log("k="+req.body.k);
    console.log("v="+req.body.v);

    var db = mongo(connection_string, ['clips']);
    var clips = db.collection('clips');
    
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
    clips.update({k:id},{v:req.body.v}, {upsert:true},
     function(err, saved) { //
           if ( saved && saved.updatedExisting ) 
                res.send({u:true});
            else               
           if ( saved && !saved.updatedExisting ) 
                res.send({u:false});
            else
                next();
                
           console.log("err:"+err);
           console.log("saved:"+JSON.stringify(saved));
     });

//    res.send('good:'+req.body.k + ',v:'+req.body.v);
}

del = function(req, res, next) {
    console.log('delete verb');
    
    var db = mongo(connection_string, ['clips']);
    var clips = db.collection('clips');
    
    clips.remove({});
    
    next();
}

var server  = function(req, res, next) {
    switch(req.method) {
        case 'GET':
            get(req,res, next);
            break;
        case 'POST':
            post(req,res, next);
            break;
        case 'DELETE':
            del(req,res,next);
            break;

    }
}; 

module.exports.server = server;
