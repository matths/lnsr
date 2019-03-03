var tap = require('tap');
var sinon = require('sinon');
var rewire = require('rewire');
var httpMocks = require('node-mocks-http');

var filterHost = rewire('../../../../lib/filter/host');

tap.test('host middleware module', function (tap) {
  var req, res;
  
  tap.beforeEach(function (done) {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      headers: {
        host: 'test-a.com'
      },
      params: {}
    });

    res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    done();
  });

  tap.test('when created without hostname', function (tap) {
    tap.plan(1);
    var filterHostMiddleware = filterHost();

    tap.false(filterHostMiddleware, 'should return false');
    tap.end();
  });

  tap.test('when created with hostname and middleware function', function (tap) {
    tap.plan(2);
    var filterHostMiddleware = filterHost('test-a.com', sinon.fake());

    tap.strictEqual(typeof filterHostMiddleware, 'function', 'should return a middleware function');
    tap.strictEqual(filterHostMiddleware.length, 3, 'that excepts three arguments by default');
    tap.end();
  });

  tap.test('when returned middleware function is used with matching host', function (tap) {
    tap.plan(4);
    var nextSpy = sinon.fake();
    var middlewareSpy = sinon.spy(function (req, res, next) {
      next();
    });

    var filterHostMiddleware = filterHost('test-a.com', middlewareSpy);
    filterHostMiddleware(req, res, nextSpy);

    tap.ok(middlewareSpy.calledOnce, 'should call middleware once');
    tap.ok(middlewareSpy.calledWith(req, res), 'should call middleware with req and res');
    tap.strictEqual(typeof middlewareSpy.lastCall.lastArg, 'function', 'should call middleware with a next function');
    tap.ok(nextSpy.calledOnce, 'should call next once after the middleware');
    tap.end();
  });

  tap.test('when returned middleware function is used with non matching host', function (tap) {
    tap.plan(2);
    var nextSpy = sinon.fake();
    var middlewareSpy = sinon.spy(function (req, res, next) {
      next();
    });

    var filterHostMiddleware = filterHost('test-b.com', middlewareSpy);
    filterHostMiddleware(req, res, nextSpy);

    tap.ok(middlewareSpy.notCalled, 'should not call middleware once');
    tap.ok(nextSpy.calledOnce, 'should call next once after the middleware');
    tap.end();
  });

  tap.test('when returned middleware function is used with no host at all', function (tap) {
    tap.plan(2);

    req = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      headers: {},
      params: {}
    });

    var nextSpy = sinon.fake();
    var middlewareSpy = sinon.spy(function (req, res, next) {
      next();
    });

    var filterHostMiddleware = filterHost('test-b.com', middlewareSpy);
    filterHostMiddleware(req, res, nextSpy);

    tap.ok(middlewareSpy.notCalled, 'should not call middleware once');
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
