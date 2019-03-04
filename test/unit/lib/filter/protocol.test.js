var tap = require('tap');
var sinon = require('sinon');
var httpMocks = require('node-mocks-http');

var filterProtocol = require('../../../../lib/filter/protocol');

tap.test('host middleware module', function (tap) {
  var req, res;
  
  tap.beforeEach(function (done) {
    res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    done();
  });

  tap.test('when created without protocol', function (tap) {
    tap.plan(1);
    var filterProtocolMiddleware = filterProtocol();
    tap.false(filterProtocolMiddleware, 'should return false');
    tap.end();
  });

  tap.test('when created with protocol and middleware function', function (tap) {
    tap.plan(2);
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      connection: {
        encrypted: true
      }
    });

    var filterProtocolMiddleware = filterProtocol('https', sinon.fake());
    tap.strictEqual(typeof filterProtocolMiddleware, 'function', 'should return a middleware function');
    tap.strictEqual(filterProtocolMiddleware.length, 3, 'that excepts three arguments by default');
    tap.end();
  });

  tap.test('when returned middleware function is used with matching protocol', function (tap) {
    tap.plan(4);
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      connection: {
        encrypted: true
      }
    });

    var nextSpy = sinon.fake();
    var middlewareSpy = sinon.spy(function (req, res, next) {
      next();
    });

    var filterProtocolMiddleware = filterProtocol('https', middlewareSpy);
    filterProtocolMiddleware(req, res, nextSpy);

    tap.ok(middlewareSpy.calledOnce, 'should call middleware once');
    tap.ok(middlewareSpy.calledWith(req, res), 'should call middleware with req and res');
    tap.strictEqual(typeof middlewareSpy.lastCall.lastArg, 'function', 'should call middleware with a next function');
    tap.ok(nextSpy.calledOnce, 'should call next once after the middleware');
    tap.end();
  });

  tap.test('when returned middleware function is used with non matching protocol', function (tap) {
    tap.plan(2);
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/'
    });

    var nextSpy = sinon.fake();
    var middlewareSpy = sinon.spy(function (req, res, next) {
      next();
    });

    var filterProtocolMiddleware = filterProtocol('https', middlewareSpy);
    filterProtocolMiddleware(req, res, nextSpy);

    tap.ok(middlewareSpy.notCalled, 'should not call middleware once');
    tap.ok(nextSpy.calledOnce, 'should call next once after the middleware');
    tap.end();
  });

  tap.test('when returned middleware function is used behind a proxy', function (tap) {
    tap.plan(4);

    req = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      headers: {
        'x-forwarded-proto': 'https,http'
      },
    });

    var nextSpy = sinon.fake();
    var middlewareSpy = sinon.spy(function (req, res, next) {
      next();
    });

    var filterProtocolMiddleware = filterProtocol('https', middlewareSpy);
    filterProtocolMiddleware(req, res, nextSpy);

    tap.ok(middlewareSpy.calledOnce, 'should call middleware once');
    tap.ok(middlewareSpy.calledWith(req, res), 'should call middleware with req and res');
    tap.strictEqual(typeof middlewareSpy.lastCall.lastArg, 'function', 'should call middleware with a next function');
    tap.ok(nextSpy.calledOnce, 'should call next once after the middleware');
    tap.end();
  });

  tap.afterEach(function (done) {
    req = null;
    res = null;
    done();
  });

  tap.end();
})
