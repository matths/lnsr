const requestFilterMiddleware = (requestFilter, middleware) => (req, res, next) =>
  (typeof requestFilter !== 'function') ? next() :
    requestFilter(req) ? middleware(req, res, next) : next();

module.exports = requestFilterMiddleware;

/*

const requestFilterMiddleware = (requestFilter, middleware) => (req, res, next) => {
    console.log('DEBUG', requestFilter, typeof requestFilter);
    if (typeof requestFilter !== 'function') {
        next();
    } else {
        if (requestFilter(req)) {
            middleware(req, res, next);
        } else {
            next();
        }
    }
}

module.exports = requestFilterMiddleware;


*/