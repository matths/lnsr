var queue = require('./queue.js');
var error = require('./error.js');
var filterHost = require('./filters/host.js');
var filterProtocol = require('.filters/protocol');

module.exports = {
  queue: queue,
  error: error,
  filter: {
  	host: filterHost,
  	protocol: filterProtocol
  }
}
