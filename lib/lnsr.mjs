import partial from './utils/partial.mjs';
import curry from './utils/curry.mjs';
import uncurry from './utils/uncurry.mjs';
import compose from './utils/compose.mjs';
import objectMap from './utils/object-map.mjs';

import queue from './queue.mjs';
import error from './error.mjs';

import authorize from './interact/authorize.mjs';
import useFilter from './interact/use-filter.mjs';

import passFilter from './filters/pass.mjs';
import blockFilter from './filters/block.mjs';
import hostFilter from './filters/host.mjs';
import protocolFilter from './filters/protocol.mjs';
import methodFilter from './filters/method.mjs';
import pathFilter from './filters/path.mjs';
import simplePathFilter from './filters/simple-path.mjs';
import contentTypeFilter from './filters/content-type.mjs';

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

const get = (pathPattern, middleware) => partial(useFilter, [methodFilter('get'), pathFilter(pathPattern)])(middleware);
const post = (pathPattern, middleware) => partial(useFilter, [methodFilter('post'), pathFilter(pathPattern)])(middleware);

export {
  queue,
  error,
  authorize,
  useFilter,
  filters,
  pass,
  block,
  host,
  protocol,
  method,
  path,
  simplePath,
  contentType,
  get,
  post
};
