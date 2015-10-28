// var gcm = require('unifiedpush-node-sender');
// var mongo = require('mongojs');
// var async = require('async');
// var db = mongo(connection_string, ['movie']);
var agSender = require( "unifiedpush-node-sender" );

var init = function() {
};

// var registerId = function(id) {
// 	var gcmDb = db.collection('movie_gcm');

//     gcmDb.update({k:id},{k:id}, {upsert:true}, function(err, saved) { //
//     		if ( err ) console.log(err);
//     });
// };

// function sendGCMId(gcmDb, registrationIds, next) {
	// var message = new gcm.Message();
	// var sender = new gcm.Sender('AIzaSyDzAK2KqaaQh_n3rHbFzZ4ST1QShuUcJhw');
	// sender.sendNoRetry(message, registrationIds, function(err, result) {
	// 	var i = 0;
 //        async.each( registrationIds, function(id, cb){
 //            if (result.results[i].error === 'NotRegistered') { // remove from db
 //                gcmDb.find({k:id}).remove();
 //            }
 //            else
 //            if (result.results[i].registration_id) { // canonical id update
	// 		    gcmDb.update({k:id},{k:result.results[i].registration_id}, {upsert:false}, function(err, saved) { //
 //    			});
 //            }
 //            i++;
 //        }, function(err) {
	// 		setTimeout(next, 0);
	// 	});
	// });
// }

// function sendGCMIds(message, next) {
// 	// var gcmDb = db.collection('movie_gcm');
// 	// gcmDb.find({}).limit(1000).skip(i, function(err, docs){
// 	// 	if ( !err ) {
// 	// 		i += 1000;

// 			var settings = {
// 			        url: "http://push-inappsoft2.rhcloud.com/ag-push",
// 			        applicationId: "073610fa-c828-4001-a4bb-c9f8ddbca33f",
// 			        masterSecret: "d7a9622b-0130-4eda-850b-c2c16c6057ef"
// 			};
// 			async.each( docs, function(doc, cb) {
// 				agSender.Sender( settings ).send( {userData:message}, null, function( err, response ) {
// 				    if( !err ) {
// 				        console.log( "success called", response );
// 				    }
// 			        cb();
// 				});
// 			},
// 			// var registrationIds = [];
// 			// async.each( docs, function(doc, cb) {
// 			// 	registrationIds.push(doc.k);
// 			// },
// 			function(err) {
// 				next();
// 			});
// 		}
// 		else
// 			setTimeout(function() {
// 				next('end');
// 			}, 0);
// 	});
// }

var send  = function(message, next) {
	var url = "http://push-inappsoft2.rhcloud.com/ag-push";
	var settings = {
	        applicationID: "f9485e72-8910-4b24-86c2-8792b61f8fe8",
	        masterSecret: "6548eb6a-55ba-4683-a9a9-c73828022f84"
	};
	agSender.Sender( url ).send( {userData:message}, settings, function( err, response ) {
        console.log( "push result:" + err + "::: resp:" + response );
        next(null);
	});
};

module.exports.init = init;
// module.exports.registerId = registerId;
module.exports.send = send;
