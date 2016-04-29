#!/bin/env node

var fs = require('fs');
var async = require('async');
var db = require('../elastic.js');
// var snappy = require('snappy');

function setStar(packageName, id, star) {
	db.get({index:'appshare', type:'as_users', id:id}, function(err, response){
        if (!err) {
            var user = response._source;
            var package1 = user.packages[packageName];
            if ( package1 ) {
                package1.star = star;
                db.index({index:'appshare', type:'as_users', id:id, body:user}, function(err, response){
                });
            }
        }
    });
}

function getRank(key, start, size, lastRank, callback) {
    var res = {};
    res.datas = [];

//  console.log("start:" + start);			
// console.log("size:" + size);			

    var useKey = false;
    var qb;
    if (!key) { 
        qb = {
        index: 'appshare',
        type: 'as_apps',
        body: {
            from: start,
            size: size,
            sort:[{downloaded:{order:'desc'}}, {'en_title':{order:'asc'}}],
            query: {
                match_all: {}
            }
        }};
// console.log("matchall");			
    }
    else {
        qb = {
        index: 'appshare',
        type: 'as_apps',
        body: {
            from: start,
            size: size,
            sort:[{downloaded:{order:'desc'}}, {'en_title':{order:'asc'}}],
            query: {
                match: {'titles.title':key}
            }
        }};
        useKey = true;
    }

    var id, source, result, hits;
	var prevDownloaded, i;
    
    db.search(qb, function (err, response) {
        if (!err) {
    		prevDownloaded = -1, i = 0;
            hits = response.hits;
            
// console.log('#$################'+hits.hits.length);
            
            if (hits.hits.length) {
                async.whilst (function(){return i < hits.hits.length},
                function(cb){
                    id = hits.hits[i]._id;
                    source = hits.hits[i]._source;
                    result = {};

                    result.packageName = id;
                    result.titles = source.titles;
                    if (result.downloaded == -1 ) {
                        result.downloaded = 1;
                    } else {
                        result.downloaded = source.downloaded;
                    }
                    result.publisher = source.publisher;
                    result.url = source.url;
        			if ( useKey ) {
                        db.count({index:'appShare', type:'as_downloads', body:{
                            query: {
                                range:{
                                    id:{gte:result.downloaded}
                                }
                            }
                        }}, function (err, response) {
                            result.rank = response.count;
// console.log('##1:'+result.rank);
                            res.datas.push(result);
                            i ++;
                            cb(null);
                        });
                    } else {
                        if ( result.downloaded != prevDownloaded ) {
                            prevDownloaded = result.downloaded;
                            if ( lastRank == 0 ) {
                                db.count({index:'appShare', type:'as_downloads', body:{
                                    query: {
                                        range:{
                                            id:{gte:result.downloaded}
                                        }
                                    }
                                }}, function (err, response) {
                                    lastRank = response.count;
                                    result.rank = lastRank;
// console.log('##2:'+result.rank);
                                    res.datas.push(result);
                                    i ++;
                                    cb(null);
                                })
                            } else {
                                lastRank ++;
                                result.rank = lastRank;
// console.log('##3:'+result.rank);
// if (result.rank == 26) {
//     console.log(JSON.stringify(result));
// }
                                res.datas.push(result);
// console.log('####1111');                                
                                i ++;
                                cb(null);
                            }
                        } else {
                            i ++;
                            cb(null);
                        }
                    }
                },
                function(err){
                    res.apps = hits.total;

//  console.log('####res ########'+JSON.stringify(res));
                    
                    db.count({index:'appShare', type:'as_users', query:{
                        match_all:{}
                    }}, function (err, response) {
                		res.users = response.count;
//  console.log('#### res 2 ########'+JSON.stringify(response));
                        callback(err, res);
                    });
                });
            } else {
                callback(err, res);
            }
        } else {
// console.log(JSON.stringify(err));            
            callback(err, res);
        }
    });
}

function putRank(req, callback) {
    var i = 0;
	async.whilst(function(){ return i < req.datas.length;},
    function(cb){
        var data = req.datas[i];
        db.index({index:'appshare', type:'as_noob', body:data}, 
        function(err, response){
            cb(null);
        });
        i ++;
    },
    function(err){
        var results = {};
        results.datas = [];
        var ids = [];
		for (var index in req.datas ) {
            var data = req.datas[index];
			ids.push(data.packageName);
		}

		db.mget({ index:"appshare", type:"as_apps",
            body:{
                ids:ids
            }},
        function(err, response){
            if (!err) {
                var i = 0;
                async.whilst(function(){ return i < response.docs.length; },
                function(cb) {
                    var app = response.docs[i]._source;
                    if (!app) {
                        i ++;
                        cb(null);
                    } else {
                        var result = {};
                        result.packageName = response.docs[i]._id;
                        result.titles = app.titles;
                        if (app.downloaded == -1) {
                            result.downloaded = 1;
                        } else {
                            result.downloaded = app.downloaded;
                        }

                        db.count({index:'appshare', type:'as_downloads', body: {
                            query: {
                                range: { 
                                    id : { gt : result.downloaded }
                                }
                            }
                        }}, function(err, response) {
                            if (!err) {
                                result.rank = response.count + 1;
                                results.datas.push(result);
                                cb(null);
                            } else {
                                cb(null);
                            }
                        });
                        i ++;
                    }
                },
                function(err) {
                    callback(null, results);
                });
            } else {
                callback('mget error');
            }
        });
    });
}
//////////////////////////////////////

var get = function(req, res, next) {
    res.end();
};

var post = function(req, res, next) {
    res.set({ 'Content-Type': 'application/octet-stream; charset=utf-8' })

    var func = req.body.f;

// console.log('func:::' + func);
    
    switch(func) {
        case '1':
// console.log('func:::1111');
            var star = false;
            if (req.body.s == 1) star = true;

            var packageName = req.body.p;
            var id = req.body.i;
            setStar(packageName, id, star);

            break;
        case '3':
// console.log('func:::3333');
            var start = Math.max(req.body.s,0);
            var size = Math.max(req.body.e,20);
            var lastRank = req.body.l;
            var key = req.body.k;
            getRank(key, start, size, lastRank, function(err, result) {
                res.send(result);
                // snappy.compress(result, function(err, compressed){
                    // res.send(compressed);
                // });
            });
            break;
         default:
// console.log('func:::dddd');
         
            res.end();
            break;
    }
};

var del = function(req, res, next) {
    res.end();
};

var put = function(req, res, next) {
    res.set({ 'Content-Type': 'application/json; charset=utf-8' });
//  console.log('put###' + JSON.stringify(req.body));

    try {
        var jsonObj = req.body;
        if (jsonObj.func == 2) {
            putRank(jsonObj, function(err, result){
    // console.log('put###2:::' + result);
                res.send(result);
                // snappy.compress(JSON.stringify(result), function(err, compressed){
                    // res.send(compressed);
                // })
            });
        } else {
            res.end();
        }
    } catch(e){
        console.log('put::exception::' + e);
        res.end();
    }
}

var server = function(req, res, next) {
    switch (req.method) {
        case 'GET':
            get(req, res, next);
            break;
        case 'POST':
            post(req, res, next);
            break;
        case 'DELETE':
            del(req, res, next);
            break;
        case 'PUT':
            put(req, res, next);
            break;
    }
};

//////////////////////////////////
var init = function(cb) {
    cb(null);
};

module.exports.init = init;
module.exports.server = server;