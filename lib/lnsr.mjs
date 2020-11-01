import partial from './utils/partial';

import queueMiddleware from './queue';
import errorMiddleware from './error';

import filterMiddleware from './filter';

import passFilter from './filters/pass';
import blockFilter from './filters/block';
import hostFilter from './filters/host';
import protocolFilter from './filters/protocol';
import methodFilter from './filters/method';
import pathFilter from './filters/path';
import simplePathFilter from './filters/simple-path';
import contentTypeFilter from './filters/content-type';

const filters = {
  pass: passFilter,
  block: blockFilter,
  host: hostFilter,
  protocol: protocolFilter,
  method: methodFilter,
  path: pathFilter,
  simplePath: simplePathFilter,
  contentType: contentTypeFilter
};

const get = (pathPattern, middleware) => partial(filterMiddleware, [methodFilter('get', pathFilter(pathPattern))])(middleware);
const post = (pathPattern, middleware) => partial(filterMiddleware, [methodFilter('post', pathFilter(pathPattern))])(middleware);

export {
  queueMiddleware as queue,
  errorMiddleware as error,
  filterMiddleware as useFilter,
  filters,
  get,
  post
}
