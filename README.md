# lnsr

lnsr (lean server) are small [node](http://nodejs.org) modules to create a lean and simple sever from scratch.
Every module in itself is a [connect](https://github.com/senchalabs/connect) compatible _middleware_.

```js
var lnsr = require('./lnsr.js')
var http = require('http')

// just use your middleware functions as arguments to queue
var middleware = lnsr.queue(
	function (req, res next) {
		res.setHeader('Content-Type', 'text/plain');
		res.write('URL: ' + req.url);
		next();
	},
	function (req, res next) {
		res.end('done');
	});

//create node.js http server and listen on port
http.createServer(middleware).listen(8080);
```
