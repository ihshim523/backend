#!/bin/env node

// var connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
//   process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
//   process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
//   process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
//   process.env.OPENSHIFT_APP_NAME;

var init = function() {
	global.mongo.connect(global.mongo, function(err, db){
		if ( !err ) {
			var clips = db.collection('clips');
			clips.ensureIndex({expire:1},{expireAfterSeconds:600});
		}
		else {
			console.log('mongo connection error:'+err);
		}
	});
};

var get = function(req, res, next) {
	global.mongo.connect(global.mongo, function(err, db){
		if ( !err ) {
			var clips = db.collection('clips');

		//    console.log("k="+req.query.k);

			id = parseInt(req.query.k);

			clips.findOne({k:id}, function(err, doc) {

		//        console.log("err:"+err);

				if ( !err ) {
					if ( !doc ) 
						res.jsonp({v:null});
					else
						res.jsonp({k:doc.k,v:doc.v});

		//            console.log("ret:" + JSON.stringify(doc));
				}
				else
					res.jsonp(err);
			});
		}
		else {
			console.log('mongo connection error:'+err);
		}
	});
};

var post = function(req, res, next) {
//    console.log('+post:');
//    console.log("k="+req.query.k);
//    console.log("v="+req.query.v);
	global.mongo.connect(global.mongo, function(err, db){
		if ( !err ) {

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

			clips.update({k:id},{k:id,v:req.query.v,expire:new Date()}, {upsert:true},
			 function(err, saved) { //
				   if ( saved && saved.updatedExisting ) 
						res.jsonp({u:true});
					else               
				   if ( saved && !saved.updatedExisting ) 
						res.jsonp({u:false});
					else
						next();
			});
		//           console.log("err:"+err);
		//           console.log("saved:"+JSON.stringify(saved));
		}
		else {
			console.log('mongo connection error:'+err);
		}
	});
//    res.send('good:'+req.body.k + ',v:'+req.body.v);
//    console.log('-post:');
};

var del = function(req, res, next) {
//    console.log('delete verb');
	global.mongo.connect(global.mongo, function(err, db){
		if ( !err ) {
    
    var clips = db.collection('clips');
    
    clips.remove({});
    
    next();
		}
		else {
			console.log('mongo connection error:'+err);
		}
	});
};

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

module.exports.init = init;
module.exports.server = server;
