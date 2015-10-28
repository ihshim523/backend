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
var gcm = require('./sendGCM.js');
//////////////////////////////////

function list(cb) {
	var feed = require("feed-read");

	console.log('+esl list');

	feed('http://feeds.feedburner.com/EnglishAsASecondLanguagePodcast', function(err, articles) {
		if (articles && articles.length > 0) {
			console.log('+esl found');
			var hash = articles[0].title.hashCode();
			db.get({index:'esl', type:'eslpod', id:'push'}, function(err, doc){
				if (!err && doc.found) {
					if (doc._source.hash !== hash) {
						console.log('+esl changed push');
						db.index({index:'esl', type:'eslpod', id:'push', body:{hash:hash}}, function(err, response){
							gcm.send('', cb);
						});
					} else {
						console.log('+esl not changed');
						cb(null);
					}
				} else {
					console.log('+esl brand new push');
					db.index({index:'esl', type:'eslpod', id:'push', body:{hash:hash}}, function(err, response){
						gcm.send('', cb);
					});
				}
			});
		} else {
			console.log('+esl article empty');
			cb(null);
		}
	});
}

var init = function(cb) {
	console.log('+esl init');
	setTimeout(function(){
		setInterval(function(){
	    list(function(){});
	  },60000);
	}, 30000);

	list(cb);
	console.log('-esl init');
};

var initTest = function() {
	list(function(){});
}

module.exports.init = init;
module.exports.initTest = initTest;
