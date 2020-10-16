const requestFilterMiddleware = (requestFilter, middleware) => (req, res, next) =>
    requestFilter(req) ? middleware(req, res, next) : next();

module.exports = requestFilterMiddleware;
