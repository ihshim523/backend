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

var db = require('../elastic.js');
//////////////////////////////////

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
				db.index({index:'hotissue',type:'music',id:'get',body:{v:compressed.toString('base64')}}, function(err){
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
				db.index({index:'hotissue',type:'music',id:'melon',body:{v:new Buffer(compressed).toString('base64')}}, function(err){
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
				db.index({index:'hotissue',type:'music',id:'mnet',body:{v:new Buffer(compressed).toString('base64')}}, function(err){
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
				db.index({index:'hotissue',type:'music',id:'bugs',body:{v:new Buffer(compressed).toString('base64')}}, function(err){
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
				db.index({index:'hotissue',type:'music',id:'soribada',body:{v:new Buffer(compressed).toString('base64')}}, function(err){
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
				db.index({index:'hotissue',type:'music',id:'dosirak',body:{v:new Buffer(compressed).toString('base64')}}, function(err){
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
				db.index({index:'hotissue',type:'music',id:'billboard',body:{v:new Buffer(compressed).toString('base64')}}, function(err){
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

function makeFile(key, cb){
	db.get({index:'hotissue',type:'music',id:key}, function(err, doc){
		if (!err && doc.found) {
			console.log(JSON.stringify(doc));
			try {
				fs.writeFile('./Music/'+key+'.dat', new Buffer(doc._source, 'base64'), function(err) {
					fs.writeFile('./Music/'+key+'5.dat', new Buffer(doc._source, 'base64'), function(err) {
						cb(null);
					});
				});
			}
			catch(e){
				console.log(JSON.stringify(e));
				cb(null);
			}
		}
		else {
			cb(null);
		}
	});
}

var list = function(cb2) {
	console.log('+list');
	// fs.writeFile('./Music/get.dat', compressed, function(err) {
	// 	cb(null);
	// });
	async.waterfall([
		function(cb){
			makeFile('get',cb);
		},
		function(cb){
			makeFile('melon',cb);
		},
		function(cb){
			makeFile('mnet',cb);
		},
		function(cb){
			makeFile('bugs',cb);
		},
		function(cb){
			makeFile('soribada',cb);
		},
		function(cb){
			makeFile('billboard',cb);
		},
	],
	function(err){
		cb2(null);
	});
}

var init = function(cb) {
	setInterval(function(){
		list(function(){});
	},60000);

	list(cb);
}

module.exports.init = init;
module.exports.server = server;
