var queue = require('./queue.js');
var error = require('./error.js');
var filterHost = require('./filter/host.js');
var filterProtocol = require('.filter/protocol');

module.exports = {
  queue: queue,
  error: error,
  filter: {
  	host: filterHost,
  	protocol: filterProtocol
  }
}
