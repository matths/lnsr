const _ = require('lodash')

// fallback error handler in case req.error is not defined
function _error (req, res, err) {
  console.error('[unhandled queue error]', err)
  res.statusCode = 500
  res.write('[unhandled queue error] ' + err)
  res.end()
}

// fifo queue
function _execute (queue, req, res, next, err) {
  if (err) {
    // check for custom error handler
    var error = !req.error ? _error : req.error
    error(req, res, err)
  } else {
    if (queue.length > 0) {
      // if there are middlewares left
      var nextMiddleware = _.first(queue)
      var remainingQueue = _.tail(queue)
      // run next middleware from queue
      nextMiddleware(req, res, function (err) {
        return _execute(remainingQueue, req, res, next, err)
      })
    } else {
      // if no more middlewares, call next()
      if (next && typeof next === 'function') {
        return next()
      } else {
        res.statusCode = 200
        res.end()
      }
    }
  }
}

// queue also detects if a middleware in the queue calls next('error') with an error argument
function _queue (q) {
  // function accepts either
  // - an array with 1..n middleware functions
  // - or 1..n middleware functions as its arguments
  var queue = Array.isArray(q) ? q : [].slice.call(arguments)

  // by default queue returns a 'connect'-style middleware function accepting three arguments (req, res, next)
  // thus it can be used as requestListener for node.js' http.Server accepting two arguments (req, res), only
  var middleware = function (req, res, next) {
    return _execute(queue, req, res, next)
  }

  return middleware
}

module.exports = _queue
