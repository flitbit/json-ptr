# json-ptr [![Build Status](https://travis-ci.org/flitbit/json-ptr.png)](http://travis-ci.org/flitbit/json-ptr)

A complete implementation of JSON Pointer (RFC 6901) for nodejs and modern browsers.

## Installation

[node.js](http://nodejs.org)
```bash
$ npm install json-ptr
```

See the [examples for more info](https://github.com/flitbit/json-ptr/tree/master/examples).

## Basics

JSON Pointer provides a standardized syntax for reliably referencing data within an object's structure.

### Importing

**nodejs**
```javascript
var JsonPointer = require('json-ptr')
```

**browser**
```html
<script src="json-ptr-0.1.0.min.js"></script>
```

### Working with Pointers

Since most non-trivial code will make use of the same pointers over and over again (after all they represent the fixed points within a larger structure), with `json-ptr`you can create these pointers once and reuse them against different data items.

```javascript
var manager = JsonPointer.create('/people/workplace/reporting/manager');
var director = JsonPointer.create('/people/workplace/reporting/director');
```

Pointers have a few simple operations:

* `#get` - given an origin object, returns the referenced value
* `#set` - given an origin object and a value, sets the referenced value

And a few useful properties:

* `#pointer` - an RFC 6901 formatted JSON pointer
* `#uriFragmentIdentifier` - an RFC 6901 formatted URI fragment identifier
* `#path` - an array of property names used to descend the object graph from the origin to the referenced item

## Example

[flikr example](https://github.com/flitbit/json-ptr/blob/master/examples/example1.js)
```javascript
var ptr = require('json-ptr')
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
```

