const filterMiddleware = (filter, middleware) => (req, res, next) =>
  (typeof filter !== 'function') ? next() :
    filter(req) ? middleware(req, res, next) : next();

module.exports = filterMiddleware;
