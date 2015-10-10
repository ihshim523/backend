#!/bin/env node

// var connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
//   process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
//   process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
//   process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
//   process.env.OPENSHIFT_APP_NAME;

var db;

var init = function(elasticsearch) {
	db = elasticsearch;

    setInterval(function(){
    	db.deleteByQuery({
			index:'hotissue',
			type:'clip',
			body:{
				"range" : {
					"expire":{
						"lte":(new Date()).getTime() - 600*1000
					}
				}
			}
		});
    },60000);
};

var get = function(req, res, next) {
  //  console.log('+get:');
  //  console.log("k="+req.query.k);

    id = parseInt(req.query.k);

    db.get({
		index:'hotissue',
		type:'clip',
		id:id}, function(err, doc) {
        // console.log("err:"+err);
        if ( !err ) {
            if ( !doc )
                res.jsonp({v:null});
            else
                res.jsonp({k:id,v:doc._source.v});

          //  console.log("ret:" + JSON.stringify(doc));
        }
        else
            res.jsonp(err);
    });
  //  console.log('-get:');
};

var post = function(req, res, next) {
//    console.log('+post:');
//    console.log("k="+req.query.k);
//    console.log("v="+req.query.v);
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

    db.index({
		index:'hotissue',
		type:'clip',
		id:id,
		body:{v:req.query.v,expire:(new Date()).getTime()}
	},
     function(err, response) { //
           if ( !err && response.created )
                res.jsonp({u:true});
            else
           if ( !err && !response.created )
                res.jsonp({u:false});
            else
                next();
//           console.log("err:"+err);
//           console.log("saved:"+JSON.stringify(saved));
     });

//    res.send('good:'+req.body.k + ',v:'+req.body.v);
//    console.log('-post:');
};

var del = function(req, res, next) {
//    console.log('delete verb');

	db.delete({
		index:'hotissue',
		type:'clip'
	});
    next();
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
