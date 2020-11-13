<img src="logo/lnsr.svg" alt="connect logo" width="120px">

**lnsr** – a <u>**l**</u>ea<u>**n**</u> <u>**s**</u>erve<u>**r**</u>

  [![npm version][npm-image]][npm-url]
  [![License: MIT][license-badge]][license]
  [![tests workflow][workflow-image]][workflow-url]

lnsr is a framework to create and completely understand your next nodejs server application.

The framework by itself is actually no server and it doesn't create a server (no `var app = connect();` or `var app = express();`, etc.). Because node already offers the necessary server, lnsr offers just a few higher order functions, mainly **[queue](#queue)** and **[filters](#filters)**, to let you glue [express][express github] and/or [connect][connect github] compatible middleware together and transparently create your next [node][node.js] server applications without magic, e.g. `app.use()`.

## Getting started

### Install module

Install the module using you favorite package manager to you application package.

```bash
$ npm install --save lnsr
$ yarn add lnsr
```

### Implement your server

Routing requests is easy and transparent using **queues** and **filters** with less magic.

```javascript
import {createServer} from 'http';
import {queue, useFilter, filters as f} from 'lnsr/index.mjs';

const lnsr = queue(
  host('example.com', redirectToWww),
  host('www.example.com', queue(
    useFilter(f.contentType('application/json'), handleApiRequest),
    useFilter(f.method('post'), parseBody),
    useFilter([f.method('get'), f.path('/user/:user')], showUser),
    useFilter([f.method('post'), f.path('/user/:user')], queue(
      saveUser,
      showUser
    ),
    showStart
  ),
  notFound
  )
)

const server = createServer(lnsr);
server.listen(80, '0.0.0.0');
```

## Documentation

**lnsr** lets you create a node based server application with less magic, fewer hidden logic or side-effects, but takes full advantage of the well-knwon middleware concept introduced by connect and express.

If you already know how to create a plain http/https server with node, and what a requestListener or a middleware function is, you can skip forward to queue and filters.

### Sever

```javascript
import {createServer} from 'http';

const requestListener = (req, res) => {
  // side-effects on req, res
  res.end('hello world');
};
const server = createServer(requestListener);
server.listen(port, host);
```

[node.js] provides already everything to come up with a [http][node.js http] / [https][node.js https] **server**. So nothing to re-invent here.
The server uses object-oriented style concepts. Main entrypoint usually is the request event one can bind a **requestListener** function to.

It accepts two parameters, **request** and **response** (objects by itself), and doesn't need a return a value. A request to the server can be answered using side effects like calling methods of the response object from within the request handler.
In theory you could bind multiple requestListeners to the servers request event, but you'll rarely see this used. Some side effects can barely triggered twice, e.g. `res.end();`

### Middleware

```javascript
const middlewareOne = (req, res, next) => {
  req.sideEffect = true;
  next();
}

const middlewareTwo = (req, res, next) => {
  if (req.hasError) next('there was an error');
  else next();
}
```

Some time ago [connect][connect github] introduced the middleware concept, a middleware being a higher order function accepting a third argument beside request and response, a callback function `next()`

Each middleware works still as a node server requestListener. A middleware can change its behavior because of side causes or trigger side effects, both because of the request and response object.
But now, as long as the middleware doesn't answers/ends the http request, it can also trigger the next callback.

Usually the next callback is triggered without any arguments. Depending on the used framework there are conventions for a single argument. The most basic one, expects `next(e)`to have in single argument in case of an error.

```javascript
const config = {stopWithError: 'emergency'};
const createMiddleware = (config) =>
  (req, res, next) =>
    config.stop?next('stop'):next();
```

There's a bunch of middleware available and usually you can configure the middleware using factory methods which just create a middleware function.

Now, the main reason to introduce the `next()` callback was to call multiple middleware functions instead of a single requestListener. And this is achieved by the frameworks own server object or `app`.

**lnsr** doesn't introduce another object, but uses another higher order function to glue the middleware pieces together.

### queue

queue is a higher order function which returns by itself a middleware function / requestListener. It expects either an array of middleware functions as a single argument or middleware functions as multiple arguments.

The middleware, when called, is then going to execute all middleware functions in the order applied, first in first out (fifo) before calling its own next callback.

Because queue returns a middleware function, a queue invocation can be used as argument to queue as well to structure you middlewar.

```javascript
import {queue} from 'lnsr/index.mjs';

const requestListener = queue(
  logRequest,
  parseBody,
  queue(
    showPage,
    notFound
  )
);
```

### filters

While other frameworks already provide a router, lnsr offers lean filter modules instead and a useFilter middleware creator function.

#### filter

A request filter when called with request as argument returns either true or false.

```javascript
const getRequestFilter = (req) => req.method.toLowerCase()==='get';
```

But **lnsr** offers some filter creation functions to configure filters for convenience.

```javascript
import {filters as f} from 'lnsr/index.mjs';

const getRequestFilter = f.method('get');
```

#### useFilter

In the end a filter (true/false) makes the decision, if a middleware is a called or skipped. When skipped `next()` is called immediately.
For that you can use `useFilter(filter, middleware)`.

```javascript
import {queue, useFilter, filters as f} from 'lnsr/index.mjs';

const parseBodyIfPost = useFilter(f.method('post'), parseBody);
```

#### createFilterMiddleware

For convenience we created middleware factories for all filters so far.

```javascript
import {queue, method} from 'lnsr/index.mjs';

const parseBodyIfPost = method('post', parseBody);
```

#### lnsr filters

So far we have these filters available:

- host, filter to implement virtual hosts
- method, filters by http method (get, post, put, …)
- path, matches with well-known path patterns (e.g. /path/:var) and adds var to req.params (side-effect!)
- contentType, filters by content-type accepted by client
- parameters, filters by parameters from querystring (`?pdf=1&lang=de`)
- and others.

### existing middleware

There's probably a huge number of existing middleware that is easily usable with lnsr as it is with connect, express or others. You don't need to rebuild everything by yourself.

Here are some useful examples.

* [node-static] serving static files
* [body-parser] parse content / payload of a http request (probably post or put)
* [morgan] server log file

## Modules

While the world goes forward and Javascript evolved, in nodejs there are still CommonJS modules everywhere.

### ESM

**lnsr** is written using syntactical sugar from ES6 and exporting functions using ESM import/export syntax, which also allows partial imports, etc.

For this to work natively in nodejs, we need to use `.mjs` suffix.

I would encourage to use ESM module syntax to use **lnsr**

```javascript
import {queue, method} from 'lnsr/index.mjs';

const requestHandler = queue(
  method('post', parseBody),
  (req, res, next) => { res.end('have fun.'); }
);
```

### CommonJS

If you're in need to use CommonJS, we have a prebuilt module file you can `require()` all the stuff. We use rollupjs to bundle things together.

```javascript
const lnsr = require('lnsr'); // or 'lnsr/index.js'

const requestHandler = lnsr.queue(
  lnsr.method('post', parseBody),
  (req, res, next) => { res.end('have fun.'); }
);
```

## Tests

We have unit tests run with [node-tap][tap]. To make middleware testing easier, we use [node-mocks-http] to mock Request and Response objects (mocked objects contain [express] like properties not needed for **lnsr**. Spying on callback execution is done with [sinon]. And for code coverage we use [c8] because of `.mjs` files and ESM modules.

## Support

Feel free to give feedback, ask for support, report [issues][issue] or to fork and submit pull requests.

## License

The code is available at [GitHub][home] under the [MIT license][license].

[npm-image]: https://img.shields.io/npm/v/lnsr.svg
[npm-url]: https://npmjs.org/package/lnsr
[workflow-image]: https://github.com/matths/lnsr/workflows/tests/badge.svg
[workflow-url]: https://github.com/matths/lnsr/actions?query=workflow%3Atests
[home]: https://github.com/matths/lnsr
[issue]: https://github.com/matths/lnsr/issues
[license]: https://github.com/matths/lnsr/blob/master/LICENSE
[license-badge]: https://img.shields.io/badge/License-MIT-yellow.svg
[node.js]: https://nodejs.org
[node.js github]: https://github.com/nodejs/node
[node.js http]: https://nodejs.org/api/http.html
[node.js https]: https://nodejs.org/api/https.html
[connect]: http://www.senchalabs.org/connect/proto.html
[connect github]: https://github.com/senchalabs/connect
[connect middleware]: https://stephensugden.com/middleware_guide/
[express]: https://github.com/expressjs/express
[express github]: https://expressjs.com
[tap]: http://www.node-tap.org
[tap github]: https://github.com/tapjs/node-tap
[sinon]: http://sinonjs.org
[sinon github]: https://github.com/sinonjs/sinon
[c8]: https://github.com/bcoe/c8
[node-mocks-http]: https://github.com/howardabrams/node-mocks-http
[node-static]: https://github.com/cloudhead/node-static
[body-parser]: https://github.com/expressjs/body-parser
[path-to-regexp]: https://github.com/pillarjs/path-to-regexp
[morgan]: https://github.com/expressjs/morgan
