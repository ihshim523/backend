#!/bin/env node

var bing = require('imnaver');

var b = bing({key:"5b3cf79266a7f34b2d102a8161826d59"})

b.search("INAPP", {target:'news'},function(error, response, body){

	if ( !error ) {
		console.log('####'+JSON.stringify(body));
		console.log(body.rss.channel[0].item[0].description[0]);
    }
	else
		console.log(body.d.results[0]);

});

