const partial = require('./utils/partial.js');

const queueMiddleware = require('./queue.js');
const errorMiddleware = require('./error.js');
const filterMiddleware = require('./filter.js');

const passFilter = require('./filters/pass.js');
const blockFilter = require('./filters/block.js');
const hostFilter = require('./filters/host.js');
const protocolFilter = require('./filters/protocol');
const methodFilter = require('./filters/method');
const pathFilter = require('./filters/path');
const simplePathFilter = require('./filters/simple-path');
const contentTypeFilter = require('./filters/content-type');

module.exports = {
  queue: queueMiddleware,
  error: errorMiddleware,
  filter: filterMiddleware,
  filters: {
    pass: passFilter,
    block: blockFilter,
  	host: hostFilter,
    protocol: protocolFilter,
    method: methodFilter,
    path: pathFilter,
    simplePath: simplePathFilter,
    contentType: contentTypeFilter
  },
  get: (pathPattern, middleware) => partial(filterMiddleware, [methodFilter('get', pathFilter(pathPattern))])(middleware),
  post: (pathPattern, middleware) => partial(filterMiddleware, [methodFilter('post', pathFilter(pathPattern))])(middleware),
}
