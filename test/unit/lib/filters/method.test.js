var tap = require('tap');
var sinon = require('sinon');
var httpMocks = require('node-mocks-http');

var filterMethod = require('../../../../lib/filters/method');

tap.test('method middleware module', function (tap) {
  var req, res;
  
  tap.beforeEach(function (done) {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/',
    });
    res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
    done();
  });

  tap.test('when created without method', function (tap) {
    tap.plan(1);
    var filterMethodMiddleware = filterMethod();
    tap.false(filterMethodMiddleware, 'should return false');
    tap.end();
  });


  tap.test('when created with invalid method', function (tap) {
    tap.plan(1);
    var filterMethodMiddleware = filterMethod(['BOOST', 'GET']);
    tap.false(filterMethodMiddleware, 'should return false');
    tap.end();
  });

  tap.test('when created with method and middleware function', function (tap) {
    tap.plan(2);
    var filterMethodMiddleware = filterMethod('get', sinon.fake());
    tap.strictEqual(typeof filterMethodMiddleware, 'function', 'should return a middleware function');
    tap.strictEqual(filterMethodMiddleware.length, 3, 'that excepts three arguments by default');
    tap.end();
  });

  tap.test('when returned middleware function is used with at least one matching method', function (tap) {
    tap.plan(4);
    var nextSpy = sinon.fake();
    var middlewareSpy = sinon.spy(function (req, res, next) {
      next();
    });

    var filterMethodMiddleware = filterMethod(['GET', 'POST'], middlewareSpy);
    filterMethodMiddleware(req, res, nextSpy);

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

    var filterMethodMiddleware = filterMethod('DELETE', middlewareSpy);
    filterMethodMiddleware(req, res, nextSpy);

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
