var _ = require('lodash');

var methods = [
  'options',
  'get',
  'head',
  'post',
  'put',
  'delete',
  'trace',
  'connect'
];

function method (method, middleware) {
  if (!method) {
    return false;
  }

  var methodArr = _.map( !_.isArray(method) ? [method] : method, _.toLower);
  if (_.difference(methodArr, methods).length > 0) {
    return false;
  }

  return function (req, res, next) {
    var matched = req.method && _.includes(methodArr, _.toLower(req.method));
    if (matched && typeof middleware === 'function') {
      return middleware(req, res, next);
    }
    return next();
  };
};

module.exports = method;
