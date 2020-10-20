const requestFilterMiddleware = (requestFilter, middleware) => (req, res, next) =>
  (typeof requestFilter !== 'function') ? next() :
    requestFilter(req) ? middleware(req, res, next) : next();

module.exports = requestFilterMiddleware;
