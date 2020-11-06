import partial from './utils/partial.mjs';
import curry from './utils/curry.mjs';
import uncurry from './utils/uncurry.mjs';
import compose from './utils/compose.mjs';

import queueMiddleware from './queue.mjs';
import errorMiddleware from './error.mjs';

import filterMiddleware from './filter.mjs';

import passFilter from './filters/pass.mjs';
import blockFilter from './filters/block.mjs';
import hostFilter from './filters/host.mjs';
import protocolFilter from './filters/protocol.mjs';
import methodFilter from './filters/method.mjs';
import pathFilter from './filters/path.mjs';
import simplePathFilter from './filters/simple-path.mjs';
import contentTypeFilter from './filters/content-type.mjs';

import authorizationMiddleware from './interact/authorization.mjs';

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

const filter2middleware = filter => uncurry(compose(curry(filterMiddleware), filter));
const path = filter2middleware(pathFilter);

const get = (pathPattern, middleware) => partial(filterMiddleware, [methodFilter('get'), pathFilter(pathPattern)])(middleware);
const post = (pathPattern, middleware) => partial(filterMiddleware, [methodFilter('post'), pathFilter(pathPattern)])(middleware);

export {
  queueMiddleware as queue,
  errorMiddleware as error,
  filterMiddleware as useFilter,
  authorizationMiddleware as authorization,
  filters,
  get,
  post,
  path
};
