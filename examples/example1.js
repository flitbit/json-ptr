var ptr = require('..')
, http = require('http')
, util = require('util')
;

var feed = "http://api.flickr.com/services/feeds/photos_public.gne?tags=surf,pipeline&tagmode=all&format=json&jsoncallback=processResponse"
/*
 * Set up some JSON pointers we'll use later... 
*/
, items = ptr.create("#/items")
, author = ptr.create("#/author")
, media = ptr.create("#/media/m")
;

function extractItems(it) {
	return items.get(it);
}

function extractAuthorAndMedia(it, i) {
	this.push({
		author: author.get(it),
		media : media.get(it)
	});
}

function processResponse(json) {
	var items = extractItems(json)
	, accum = []
	;

	if (items && Array.isArray(items)) {
		items.forEach(extractAuthorAndMedia, accum);
	}

	console.log( util.inspect(accum, true, 99) );
}

http.get(feed, function(res) {
	console.log("Got response: " + res.statusCode);

	var data = '';

	res.on('data', function (chunk){
		data += chunk;
	});

	res.on('end',function(){
		// result is formatted as jsonp... this is for illustration only.
		eval(data);
	})
}).on('error', function(e) {
	console.log("Got error: " + e.message);
});
