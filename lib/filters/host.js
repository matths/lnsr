function host (hostname, middleware) {
  if (!hostname) return false;
  var regexp = new RegExp('^' + hostname.replace(/[^*\w]/g, '$&').replace(/[*]/g, '(?:.*?)') + '$', 'i');

  return function (req, res, next) {
    if (!req.headers || !req.headers.host) {
      return next();
    }
    var host = req.headers.host.split(':')[0];
    if (regexp.test(host) & typeof middleware === 'function') {
      return middleware(req, res, next);
    }
    return next();
  };
}

module.exports = host;
