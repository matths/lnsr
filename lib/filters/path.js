var url = require('url');

function split (path) {
  if (!path || typeof path !== 'string') {
    return false;
  }
  return path.match(/\/[^\/\z]+/gi) || false;
}

function match (patternParts, reqPathParts) {
  if (patternParts.length > reqPathParts.length) {
    return false;
  }
  var params = {};
  var doesNotMatch = patternParts.reduce( (doesNotMatch, patternPart, index) => {
    var reqPathPart = reqPathParts[index];

    if (patternPart.match(/^\/\:.*$/gi)) {
      var varValue = reqPathPart.replace(/^\//,'');
      var varName = patternPart.replace(/^\/\:/,'');
      params[varName] = varValue;
      return false;
    } else {
      return patternPart !== reqPathPart;
    }
  }, false);
  return doesNotMatch || params;
}

function path (pattern, middleware) {
  var patternParts = split(pattern);
  if (patternParts===false) {
    return false;
  }

  return function (req, res, next) {
    var reqPath = url.parse(req.url, true).pathname;
    var reqPathParts = split(reqPath);

    var matched = false;
    if (reqPathParts !== false) {
      matched = match(patternParts, reqPathParts);
      if (matched) {
        if (!req['params']) req.params = {};
        req.params = {...req.params, ...matched};
        matched = true;
      }
    }
    if (matched && typeof middleware === 'function') {
      return middleware(req, res, next);
    }
    return next();
  };
};

module.exports = path;
