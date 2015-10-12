#!/bin/env node

var fs = require('fs');
var zlib = require('zlibjs');
var async = require('async');
var lz = require('lz-string');

// var connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
//   process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
//   process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
//   process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
//   process.env.OPENSHIFT_APP_NAME;

var db;
//////////////////////////////////
var init = function(elasticsearch) {
	db = elasticsearch;
};

var get = function(req, res, next) {
	try{
	    music.findOne({k:req.query.k}, function(err, doc) {
	    	if (!err) {
	    		//console.log("DOC:::"+JSON.stringify(doc));

	    	    var input = new Buffer(JSON.stringify(doc));
	    	    zlib.deflate(input, function(err,compressed) {
	    	    	if (!err)
						res.send(compressed);
					else
						res.end();
				});
	    	}
	    	else
	    		res.end();
	    });
	}
	catch(e) {
		res.end();
	}

};

var post = function(req, res, next) {
    var input = new Buffer(req.body.k);

    var obj = JSON.parse(req.body.k);

    zlib.deflate(input, function(err, compressed){
		try {
			async.waterfall([
			function(cb){
				// fs.writeFile('./Music/get.dat', compressed, function(err) {
				// 	cb(null);
				// });
				db.index({index:'hotissue',type:'music',id:'get.dat',body:{v:compressed.toString('base64')}}, function(err){
					if (err) {
						console.log('get.dat:::'+JSON.stringify(err));
					}
					cb(null);
				})
			},
			function(cb) {
				var ranking = {rank:[]};

				obj.rank.forEach(function(item){
					if ( item.site === 'melon' )
						ranking.rank.push(item);
				});

				var compressed = lz.compressToUTF16(JSON.stringify(ranking));
				// fs.writeFile('./Music/melon.dat', compressed, function(err) {
				// 	fs.writeFile('./Music/melon5.dat', compressed, function(err) {
				// 		cb(null);
				// 	});
				// });
				db.index({index:'hotissue',type:'music',id:'melon.dat',body:{v:compressed}}, function(err){
					if (err) {
						console.log('get.dat:::'+JSON.stringify(err));
					}
					cb(null);
				})
			},
			function(cb) {
				var ranking = {rank:[]};

				obj.rank.forEach(function(item){
					if ( item.site === 'mnet' )
						ranking.rank.push(item);
				});

				var compressed = lz.compressToUTF16(JSON.stringify(ranking));
				// fs.writeFile('./Music/mnet.dat', compressed, function(err) {
				// 	fs.writeFile('./Music/mnet5.dat', compressed, function(err) {
				// 		cb(null);
				// 	});
				// });
				db.index({index:'hotissue',type:'music',id:'mnet.dat',body:{v:compressed}}, function(err){
					if (err) {
						console.log('get.dat:::'+JSON.stringify(err));
					}
					cb(null);
				})
			},
			function(cb) {
				var ranking = {rank:[]};

				obj.rank.forEach(function(item){
					if ( item.site === 'bugs' )
						ranking.rank.push(item);
				});

				var compressed = lz.compressToUTF16(JSON.stringify(ranking));
				// fs.writeFile('./Music/bugs.dat', compressed, function(err) {
				// 	fs.writeFile('./Music/bugs5.dat', compressed, function(err) {
				// 		cb(null);
				// 	});
				// });
				db.index({index:'hotissue',type:'music',id:'bugs.dat',body:{v:compressed}}, function(err){
					if (err) {
						console.log('get.dat:::'+JSON.stringify(err));
					}
					cb(null);
				})
			},
			function(cb) {
				var ranking = {rank:[]};

				obj.rank.forEach(function(item){
					if ( item.site === 'soribada' )
						ranking.rank.push(item);
				});

				var compressed = lz.compressToUTF16(JSON.stringify(ranking));
				// fs.writeFile('./Music/soribada.dat', compressed, function(err) {
				// 	fs.writeFile('./Music/soribada5.dat', compressed, function(err) {
				// 		cb(null);
				// 	});
				// });
				db.index({index:'hotissue',type:'music',id:'soribada.dat',body:{v:compressed}}, function(err){
					if (err) {
						console.log('get.dat:::'+JSON.stringify(err));
					}
					cb(null);
				})
			},
			function(cb) {
				var ranking = {rank:[]};

				obj.rank.forEach(function(item){
					if ( item.site === 'dosirak' )
						ranking.rank.push(item);
				});

				var compressed = lz.compressToUTF16(JSON.stringify(ranking));
				// fs.writeFile('./Music/dosirak.dat', compressed, function(err) {
				// 	fs.writeFile('./Music/dosirak5.dat', compressed, function(err) {
				// 		cb(null);
				// 	});
				// });
				db.index({index:'hotissue',type:'music',id:'dosirak.dat',body:{v:compressed}}, function(err){
					if (err) {
						console.log('get.dat:::'+JSON.stringify(err));
					}
					cb(null);
				})
			},
			function(cb) {
				var ranking = {rank:[]};

				obj.rank.forEach(function(item){
					if ( item.site === 'billboard' )
						ranking.rank.push(item);
				});

				var compressed = lz.compressToUTF16(JSON.stringify(ranking));
				// fs.writeFile('./Music/billboard.dat', compressed, function(err) {
				// 	fs.writeFile('./Music/billboard5.dat', compressed, function(err) {
				// 		cb(null);
				// 	});
				// });
				db.index({index:'hotissue',type:'music',id:'billboard.dat',body:{v:compressed}}, function(err){
					if (err) {
						console.log('get.dat:::'+JSON.stringify(err));
					}
					cb(null);
				})
			}],
			function(err) {
				 res.send('{"R":"1"}');
			});
		}
		catch(e) {
			res.end();
		}
	});
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

var list = function(id, res, next) {
	console.log('+list');
	db.get({index:'hotissue',type:'music',id:id}, function(err, doc){
		if (!err && doc.found) {
			console.log(JSON.stringify(doc));
			try {
				res.send(new Buffer(doc._source, 'base64'));
			}
			catch(e){
				console.log(JSON.stringify(e));
			}
		}
		else {
			res.end();
		}
	});
};

var list2 = function(id, res, next) {
	console.log('+list2');
	db.get({index:'hotissue',type:'music',id:id}, function(err, doc){
		console.log(JSON.stringify(doc));
		if (!err && doc.found) {
			try {
				res.send(doc._source);
			}
			catch(e){
				console.log(JSON.stringify(e));
			}
		}
		else {
			res.end();
		}
	});
};

module.exports.init = init;
module.exports.server = server;
module.exports.list = list;
module.exports.list2 = list2;
