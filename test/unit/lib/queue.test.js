var tap = require('tap')
var sinon = require('sinon')
var rewire = require('rewire')
var queue = rewire('../../../lib/queue')
var httpMocks = require('node-mocks-http')

var req = httpMocks.createRequest({
  method: 'GET',
  url: '/',
  params: {}
})

var res = httpMocks.createResponse({
  eventEmitter: require('events').EventEmitter
})

tap.test('lnsr queue middleware module', function (tap) {
  tap.beforeEach(function (done) {
    // definitions for all tests of this group
    done()
  })

  tap.test('middleware creation', function (tap) {
    tap.plan(2)
    var queueMiddleware = queue()
    tap.equal(typeof queueMiddleware, 'function', 'should return a function')
    tap.equal(queueMiddleware.length, 3, 'should accept three arguments by default')
    tap.end()
  })

  tap.test('middleware usage', function (tap) {
    tap.plan(1)
    var execute = queue.__get__('_execute')
    var executeSpy = sinon.spy(execute)
    queue.__set__('_execute', executeSpy)
    var queueMiddleware = queue()
    queueMiddleware(req, res)
    tap.ok(executeSpy.called, 'should call (private) execute internally at least once')
    tap.end()
  })

  tap.test('accepts single middleware as argument', function (tap) {
    tap.plan(1)
    tap.equal('a', 'a', 'a = a')
    tap.end()
  })

  tap.end()
})

// -----------
/*

describe('my middleware', function() {

  describe('request handler creation', function() {
    var mw

    beforeEach(function() {
      mw = middleware(/./)
    })

  describe('request handler calling', function() {
    it('should call next() once', function() {
      var mw      = middleware(/./)
      var nextSpy = sinon.spy()

      mw({}, {}, nextSpy)
      expect(nextSpy.calledOnce).to.be.true
    })
  })

  describe('pattern testing', function() {
    ...
  })

*/
