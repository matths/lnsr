const queue = require('./queue.js');
const error = require('./error.js');
const filter = require('./filter.js');
const passFilter = require('./filters/pass.js');
const blockFilter = require('./filters/block.js');
const hostFilter = require('./filters/host.js');
const protocolFilter = require('.filters/protocol');
const methodFilter = require('.filters/method');
const pathFilter = require('.filters/path');

module.exports = {
  queue: queue,
  error: error,
  filter: filter,
  filters: {
    pass: passFilter,
    block: blockFilter,
  	host: hostFilter,
    protocol: protocolFilter,
    method: methodFilter,
    path: pathFilter
  }
}
