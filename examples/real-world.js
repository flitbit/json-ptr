
var ptr = require('..'),
  http = require('http'),
  util = require('util');

// A flickr feed, tags surf,pipeline
var feed = 'http://api.flickr.com/services/feeds/photos_public.gne?tags=surf,pipeline&tagmode=all&format=json&jsoncallback=processResponse';

// Compile/prepare the pointers...
var items = ptr.create('#/items');
var author = ptr.create('#/author');
var media = ptr.create('#/media/m');

function processResponse(json) {
  var data = items.get(json);

  if (data && Array.isArray(data)) {
    var images = data.reduce((acc, it) => {
      // Using the prepared pointers to select parts...
      acc.push({
        author: author.get(it),
        media: media.get(it)
      });
      return acc;
    }, []);
    console.log(util.inspect(images, false, 9));
  }
}

http.get(feed, function(res) {
  var data = '';

  res.on('data', function(chunk) {
    data += chunk;
  });

  res.on('end', function() {
    // result is formatted as jsonp... this is for illustration only.
    data = eval(data); // eslint-disable-line no-eval
    processResponse(data);
  });
}).on('error', function(e) {
  console.log('Got error: ' + e.message);
});
