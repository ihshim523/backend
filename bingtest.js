#!/bin/env node

var bing = require('imbing');

var b = bing({appId:"FQZSDW8smUSeIdMXd3Yg4dkxhb4JNSNP2nPvcZK6/wE="})

b.search("INAPP", {sources:'News', limit:10},function(error, response, body){

	if ( !error ) {
    	console.log(body.d.results[0].ID) ;
    	console.log(body.d.results[0].Title) ;
    	console.log(body.d.results[0].Url) ;
    	console.log(body.d.results[0].Source) ;
    	console.log(body.d.results[0].Description) ;
    }
	else
		console.log(body.d.results[0]);

});

