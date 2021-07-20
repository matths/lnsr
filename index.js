'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var url = require('url');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var url__default = /*#__PURE__*/_interopDefaultLegacy(url);

const partial = (fn, ...args) => fn.bind(null, ...args);

const curry = (fn, arity = fn.length, ...args) =>
  arity <= args.length ? fn(...args) : curry.bind(null, fn, arity, ...args);

const uncurry = f => (x, y) => f(x)(y);

const compose = (...fns) => (...args) =>
  fns
    .slice(0, fns.length - 1)
    .reduceRight((result, fn) => fn(result), fns[fns.length - 1](...args));

const objectMap = (obj, fn) =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, fn(v, k, i)]
    )
  );

const error$1 = (err, req, res) => {
  // console.error('[unhandled queue error]', err);
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
    const errorHandler = !req.error ? error$1 : req.error;
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

const queue = (...args) => {
  const q = args.length > 0 && Array.isArray(args[0]) ? args[0] : args;
  return (req, res, next) => execute(q, req, res, next);
};

const error = customError => (req, res, next) => {
  if (customError) req.error = customError;
  return next();
};

const atob = str => Buffer.from(str, 'base64').toString('ascii');

const hasUsers = users => Object.entries(users).length > 0;

const userIncludedAndCorrect = (users, authorizationHeader) => {
  if (!authorizationHeader) return false;
  if (!hasUsers(users)) return false;

  const [type, value] = authorizationHeader.split(' ');
  if (type.toLowerCase() !== 'basic') return false;

  const [username, password] = atob(value).split(':');
  if (!Object.keys(users).includes(username)) return false;

  return users[username] === password;
};

const authorize = (config, middleware) => {
  return (req, res, next) => {
    if (config['users'] && userIncludedAndCorrect(config.users, req.headers.authorization)) {
      middleware(req, res, next);
    } else {
      const realm = config['realm'] ? config.realm : 'Authorized users only.';
      res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="' + realm + '"' });
      res.end('Unauthorized');
    }
  };
};

const useFilter = (filters, middleware) => (req, res, next) => {
  filters = Array.isArray(filters) ? filters : (filters ? [filters] : []);
  filters.length>0 && filters.reduce((matching, filter) => matching && typeof filter === 'function' && filter(req), true)
    ? middleware(req, res, next) : next();
};

const pass$1 = () =>
  () => true;

const block$1 = () =>
  () => false;

const host$1 = hostname => {
  if (!hostname) return false;
  const regexp = new RegExp('^' + hostname.replace(/[^*\w]/g, '$&').replace(/[*]/g, '(?:.*?)') + '$', 'i');
  return req => {
    if (!req.headers || !req.headers.host) return false;
    const host = req.headers.host.split(':')[0];
    return regexp.test(host);
  };
};

const protocol$1 = proto => {
  if (!proto) return false;
  return req => {
    let p = req.connection && req.connection.encrypted ? 'https' : 'http';
    p = req.headers['x-forwarded-p'] || p;
    p = p.split(/\s*,\s*/)[0];
    return proto === p;
  };
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

const method$1 = (methods) => {
  if (!methods) return false;
  methods = Array.isArray(methods) ? methods : [methods];
  methods = methods
    .map(method => method.toLowerCase())
    .filter(method => allowedMethods.includes(method));
  if (methods.length==0) return false;
  return req => (req.method && methods.includes(req.method.toLowerCase()));
};

const splitAtSlashes = path => typeof path === 'string' && path.match(/\/[^/]+/gi) || false;
const isPlaceholderSegment = segment => segment.match(/^\/:.*$/gi);
const removeLeadingSlash = segment => segment.replace(/^\//,'');
const removeLeadingSlashAndColon = segment => segment.replace(/^\/:/,'');

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

const path$1 = pattern => {
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

const simplePath$1 = str => req =>
  url__default['default'].parse(req.url, true).pathname.indexOf(str) != -1;

const contentType$1 = type => {
  if (!type) return false;
  let types = Array.isArray(type) ? type : [type];
  types = types.map(type => type.toLowerCase());

  return req => {
    if (!req.headers || !req.headers['content-type']) return false;
    return types.includes(req.headers['content-type'].toLowerCase());
  };
};

const filters = {
  pass: pass$1,
  block: block$1,
  host: host$1,
  protocol: protocol$1,
  method: method$1,
  path: path$1,
  simplePath: simplePath$1,
  contentType: contentType$1
};

const createFilterMiddlewareFactory = filter => uncurry(compose(curry(useFilter), filter));
const fm = objectMap(filters, (filter) => createFilterMiddlewareFactory(filter));

const pass = fm.pass;
const block = fm.block;
const host = fm.host;
const protocol = fm.protocol;
const method = fm.method;
const path = fm.path;
const simplePath = fm.simplePath;
const contentType = fm.contentType;

const get = (pathPattern, middleware) => partial(useFilter, [method$1('get'), path$1(pathPattern)])(middleware);
const post = (pathPattern, middleware) => partial(useFilter, [method$1('post'), path$1(pathPattern)])(middleware);

exports.authorize = authorize;
exports.block = block;
exports.contentType = contentType;
exports.error = error;
exports.filters = filters;
exports.get = get;
exports.host = host;
exports.method = method;
exports.pass = pass;
exports.path = path;
exports.post = post;
exports.protocol = protocol;
exports.queue = queue;
exports.simplePath = simplePath;
exports.useFilter = useFilter;
