var http = require('http')
var lnsr = require('../index.js')

var middlewareGood = function (req, res, next) {
  console.log('good')
  res.write('good\n')
  next()
}

var middlewareBad = function (req, res, next) {
  console.log('bad')
  res.write('bad\n')
  next('break queue') // error
}

var requestListener1 = lnsr.queue(
  middlewareGood,
  middlewareGood,
  middlewareBad,
  middlewareGood
)

var requestListener2 = lnsr.queue([
  middlewareGood,
  middlewareGood,
  middlewareGood
])

http.createServer(requestListener1).listen(8001)
http.createServer(requestListener2).listen(8002)

// curl http://localhost:8001
// curl http://localhost:8002
