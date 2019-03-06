# lnsr

lnsr (lean server) is a small (and maybe growing) collection of small [node][node.js] modules to create a lean and simple sever from scratch.
Every part of it is a [connect][connect github] and [express][express github] compatible _middleware_.

In contrast to connect and express, there's no createServer that will create an app object to mount middleware functions or which does the routing.
Instead there's a *queue* middleware, which runs through a list of middleware functions. It also supports the convention to use a third parameter next.
The combination of the queue with filtering and other middleware modules might lead to a flexible and transparent routing of requests to the right middleware that is eventually sends out a response.

While other node frameworks speak of a middleware stack, we like the idea of a queue, following a first-in-first-out principle.
The driving goal for this project was to understand what such frameworks exactly do. By separating every task into its own middleware, it tries to make things more easy to understand. It also tries to minimize the use of outside dependencies (beside [lodash][lodash]).

lnsr is not meant as a piece of production ready software but a growing attempt to learn and document all of our findings.

### example

```js
var lnsr = require('./lnsr.js')
var http = require('http')
var https = require('https')
var fs = require('fs')

var redirectToWWW = function (req, res, next) {
  res.writeHead(302, {'Location': 'http://www.' + req.headers.host + req.url});
  res.end();
}

var sayHello = function (req, res, next) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello ' + req.params.name);
};

var notFound = function (req, res, next) {
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.end('not found.');
};

// use your middleware functions as arguments to queue
var middleware = lnsr.queue(
  lnsr.host('example.com', redirectToWWW),
  lnsr.host('www.example.com', lnsr.queue(
    lnsr.filter.method('post', queue(
      parseBody
    ))
    lnsr.filter.method('get', queue(
      lnsr.filter.path('/hello/:name', sayHello),
      lnsr.filter.path('/user/:user-id', profile),
      lnsr.filter.path('/user/:user-id/logout', logout)
    )),
  )),
  notFound
);

//create node.js http and https server and listen on ports
http.createServer(middleware).listen(8080);

var options = {
  key: fs.readFileSync('ssl/key.pem'),
  cert: fs.readFileSync('ssl/cert.pem')
}
https.createServer(options, requestListener).listen(8443);
```

## Introduction

### server
[node.js] provides already everything to come up with a [http][node.js http] / [https][node.js https] server. So almost every framworks entrypoint usually is the requestListener attached to either http.createServer or https.createServer. The requestListener itself has two arguments, the Request and Response objects for the current call to the server.

### middleware

Everything is a middleware. Starting from the very first requestListener one could either manage everything within that or hand-over the task of responding to the request to further functions. The established concept for this hand-over is called middleware. A middleware ist a function similar to the requestListener, but has in contrast a third parameter next. So each middleware has one of these three options.

- respond to the request and do not call next
- do not respond and trigger the handover to another middleware by calling next
- call next with a parameter in case of an error

@grncdr has a nice short introduction on [connect middleware].

### queue

To enable a middleware queue or stack and take advantage of the next() callback, you can just use the lnsr.queue middleware.
It works either as a requestListener to the node http and https server, but also as a middleware itself, accepting a next parameter.
In case of a fall-through, it would by itself call the next() callback.

```js
var requestListener = lnsr.queue(
  lnsr.filter.host('user-and-books.com'. queue(
    lnsr.filter.path('/user/:user-id', userMiddleware),
    lnsr.filter.path('/user/books/', userBooksMiddleware),
    lnsr.filter.path('/book/:book-id', bookMiddleware)
  )),
  lnsr.filter.host('another.com'. queue(
  ))
);
```

### filter

While other frameworks already provide a router, lnsr tries to implement some basic filter middleware modules.
When a filter matches, Request and Response and the next() callback are hand-over to a specific middleware module (which could also be another queue).
In case of no match, the next middleware in the surroundig queue is called.
This enables a flexible routing mechanism in code.

Where are already some fitlers and more are possible and might follow in future:

- protocol, filters by either 'http' or 'https'
- host, is very similar and based on connects vhost middleware
- method, filters by http method (get, post, put, ...)
- path, matches with well-known path patterns (e.g. /path/:var). 
- authentication, not yet implemented, but also an authentication header would be some kind of a filter

Of cource we don't need to reinvent the wheel and can use established filtering middleware modules or build our own based on established helper methods, like [path-to-regexp][path-to-regexp]

### state

- cookie
- session

### parser

- body
- form
- json

### existing middleware (as a starting point)

There's probably a huge number of existing middleware that is easily usable with connect, express and with lnsr, too. You probably would not build everything by yourself, so here's a list to get you started.

* [node-static] serving static files
* [body-parser] parse content / payload of a http request (probably post or put)
* [greenlock-express] provide and renew ssl certificates by letsencrypt
* [morgan] server log file

## Tests

Unit testing middleware is not easy. One tends to do functional tests and fire requests against a server. So we tested our middleware modules isolated. For that we have used:

- [node-tap][tap], so each test is a running node application.
- [node-mocks-http] to mock Request and Response, also the mocked Request object is no plain node request object, but more of an [express] one, already enriched with stuff we don't need or want.
- [sinon] to spy on methods being called and with which parameters, etc.
- [rewire] to even test or spy on otherwise private module methods


## Support

- Any bugs about Markdown Preview please feel free to report [here][issue].
- And you are welcome to fork and submit pull requests.

## License

The code is available at [GitHub][home] under the [MIT license][license].

[home]: https://github.com/matths/lnsr
[issue]: https://github.com/matths/lnsr/issues
[license]: https://github.com/matths/lnsr/blob/master/LICENSE
[node.js]: https://nodejs.org
[node.js github]: https://github.com/nodejs/node
[node.js http]: https://nodejs.org/api/https.html
[node.js https]: https://nodejs.org/api/https.html
[connect]: http://www.senchalabs.org/connect/proto.html
[connect github]: https://github.com/senchalabs/connect
[connect middleware]: https://stephensugden.com/middleware_guide/
[express]: https://github.com/expressjs/express
[express github]: https://expressjs.com
[lodash]: https://lodash.com
[lodash github]: https://github.com/lodash/lodash
[tap]: http://www.node-tap.org
[tap github]: https://github.com/tapjs/node-tap
[sinon]: http://sinonjs.org
[sinon github]: https://github.com/sinonjs/sinon
[rewire]: https://github.com/jhnns/rewire
[greenlock-express]: https://github.com/daplie/greenlock-express
[node-static]: https://github.com/cloudhead/node-static
[body-parser]: https://github.com/expressjs/body-parser
[path-to-regexp]: https://github.com/pillarjs/path-to-regexp
[morgan]: https://github.com/expressjs/morgan
[node-mocks-http]: https://github.com/howardabrams/node-mocks-http
