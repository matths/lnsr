'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var url = require('url');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var url__default = /*#__PURE__*/_interopDefaultLegacy(url);

const partial = (fn, ...args) => fn.bind(null, ...args);

const error = (err, req, res, next) => {
  console.error('[unhandled queue error]', err);
  res.statusCode = 500;
  res.write('Internal server error.');
  res.end();
};

const empty = (req, res) => {
  res.statusCode = 200;
  res.end();
};

const execute = (queue, req, res, next, err) => {
  if (err) {
    const errorHandler = !req.error ? error : req.error;
    errorHandler(err, req, res, next);
  } else {
    if (queue.length > 0) {
      const [firstMiddleware, ...remainingQueue] = queue;
      const nextNext = (err) => execute(remainingQueue, req, res, next, err);
      try {
        firstMiddleware(req, res, nextNext);
      } catch (e) {
        nextNext(e);
      }
    } else {
      if (next && typeof next === 'function') {
        return next();
      } else {
        empty(req, res);
      }
    }
  }
};

const queueMiddleware = (...args) => {
    const queue = args.length > 0 && Array.isArray(args[0]) ? args[0] : args;
    return (req, res, next) => execute(queue, req, res, next);
};

const errorMiddleware = customError => (req, res, next) => {
  if (customError) req.error = customError;
  return next();
};

const filterMiddleware = (filters, middleware) => (req, res, next) => {
  filters = Array.isArray(filters) ? filters : (filters ? [filters] : []);
  filters.length>0 && filters.reduce((matching, filter) => matching && typeof filter === 'function' && filter(req), true)
    ? middleware(req, res, next) : next();
};

const passFilter = () => (req) => true;

const blockFilter = () => (req) => false;

const hostnameFilter = hostname => {
  if (!hostname) return false;
  const regexp = new RegExp('^' + hostname.replace(/[^*\w]/g, '$&').replace(/[*]/g, '(?:.*?)') + '$', 'i');
  return req => {
    if (!req.headers || !req.headers.host) return false;
    const host = req.headers.host.split(':')[0];
    return regexp.test(host);
  }
};

const protocolFilter = protocol => {
  if (!protocol) return false;
  return req => {
    let proto = req.connection && req.connection.encrypted ? 'https' : 'http';
    proto = req.headers['x-forwarded-proto'] || proto;
    proto = proto.split(/\s*,\s*/)[0];
    return protocol === proto;
  }
};

const allowedMethods = [
  'options',
  'get',
  'head',
  'post',
  'put',
  'delete',
  'trace',
  'connect'
];

const methodFilter = (methods) => {
  if (!methods) return false;
  methods = Array.isArray(methods) ? methods : [methods];
  methods = methods
    .map(method => method.toLowerCase())
    .filter(method => allowedMethods.includes(method));
  if (methods.length==0) return false;
  return req => (req.method && methods.includes(req.method.toLowerCase()));
};

const splitAtSlashes = path => typeof path === 'string' && path.match(/\/[^\/]+/gi) || false;
const isPlaceholderSegment = segment => segment.match(/^\/\:.*$/gi);
const removeLeadingSlash = segment => segment.replace(/^\//,'');
const removeLeadingSlashAndColon = segment => segment.replace(/^\/\:/,'');

const identifyParams = (patternSegments, pathSegments) => {
  return patternSegments.reduce( (params, patternSegment, index) => {
    if (isPlaceholderSegment(patternSegment)) {
      const key = removeLeadingSlashAndColon(patternSegment);
      const value = removeLeadingSlash(pathSegments[index]);
      params[key] = value;
    }
    return params;
  }, {});
};

const matchesTheQuery = (patternSegments, pathSegments) => {
  return patternSegments.reduce( (doesMatch, patternSegment, index) =>
    !isPlaceholderSegment(patternSegment) ?
    (patternSegment === pathSegments[index]) && doesMatch :
    doesMatch
  , true);
};

const pathFilter = pattern => {
  const patternSegments = splitAtSlashes(pattern);
  if (patternSegments===false) return false;

  return req => {
    const pathSegments = splitAtSlashes(url__default['default'].parse(req.url, true).pathname);
    if (pathSegments===false) return false;
    if (patternSegments.length > pathSegments.length) return false;
    if (!matchesTheQuery(patternSegments, pathSegments)) return false;
    const params = identifyParams(patternSegments, pathSegments);
    req.params = {...req.params, ...params};
    return true;
  };
};

const simplePathFilter = str => req =>
  url__default['default'].parse(req.url, true).pathname.indexOf(str) != -1;

const contentTypeFilter = contentType => {
  if (!contentType) return false;
  let contentTypes = Array.isArray(contentType) ? contentType : [contentType];
  contentTypes = contentTypes.map(contentType => contentType.toLowerCase());

  return req => {
    if (!req.headers || !req.headers['content-type']) return false;
    return contentTypes.includes(req.headers['content-type'].toLowerCase());
  };
};

const filters = {
  pass: passFilter,
  block: blockFilter,
  host: hostnameFilter,
  protocol: protocolFilter,
  method: methodFilter,
  path: pathFilter,
  simplePath: simplePathFilter,
  contentType: contentTypeFilter
};

const get = (pathPattern, middleware) => partial(filterMiddleware, [methodFilter('get', pathFilter(pathPattern))])(middleware);
const post = (pathPattern, middleware) => partial(filterMiddleware, [methodFilter('post', pathFilter(pathPattern))])(middleware);

exports.error = errorMiddleware;
exports.filters = filters;
exports.get = get;
exports.post = post;
exports.queue = queueMiddleware;
exports.useFilter = filterMiddleware;
