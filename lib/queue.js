var _ = require('lodash');

function error (err, req, res, next) {
  console.error('[unhandled queue error]', err);
  res.statusCode = 500;
  res.write('[unhandled queue error] ' + err);
  res.end();
};

function empty (req, res) {
  res.statusCode = 200;
  res.end();
};

function execute (queue, req, res, next, err) {
  if (err) {
    var errorHandler = !req.error ? error : req.error;
    errorHandler(err, req, res, next);
  } else {
    if (queue.length > 0) {
      var nextMiddleware = _.first(queue);
      var remainingQueue = _.tail(queue);
      var nextNext = function (err) {
        return execute(remainingQueue, req, res, next, err);
      };
      nextMiddleware(req, res, nextNext);
    } else {
      if (next && typeof next === 'function') {
        return next();
      } else {
        empty(req, res);
      }
    }
  }
};

function queue (firstArg) {
  var args = _.toArray(arguments);
  var queue = _.isArray(firstArg) ? firstArg : args;
  var middleware = function (req, res, next) {
    return execute(queue, req, res, next);
  }
  return middleware;
}

module.exports = queue;
