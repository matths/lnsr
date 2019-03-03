var queue = require('./queue.js')
var filterHost = require('./filter/host.js')

module.exports = {
  queue: queue,
  filter: {
  	host: filterHost
  }
}
