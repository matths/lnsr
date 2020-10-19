var tap = require('tap');
var sinon = require('sinon');
var httpMocks = require('node-mocks-http');

var requestFilterMiddleware = require('../../../lib/filter');

tap.test('request filter middleware module', function (tap) {
  var req, res, returnTrue, returnFalse;
  
  tap.beforeEach(function (done) {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/user/Bob',
    });
    res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
    returnTrue = () => true;
    returnFalse = () => false;
    done();
  });

  tap.test('when created', function (tap) {
    tap.plan(1);

    middleware = (req, res, next) => {
        next();
    };

    tap.strictEqual(typeof requestFilterMiddleware(returnTrue, middleware), 'function', 'should return a middleware function');
    tap.end();
  });

  tap.test('when running with without a filter function', function (tap) {
    tap.plan(2);

    var nextSpy = sinon.fake();
    var middlewareSpy = sinon.spy( (req, res, next) => {
      next();
    });

    requestFilterMiddleware(false, middlewareSpy)(req, res, nextSpy);
    tap.strictEqual(middlewareSpy.callCount, 0, 'should not call middleware');
    tap.ok(nextSpy.calledOnce, 'should call next function');
    tap.end();
  });


  tap.test('when running with with a matching filter', function (tap) {
    tap.plan(4);

    var nextSpy = sinon.fake();
    var middlewareSpy = sinon.spy( (req, res, next) => {
      next();
    });

    requestFilterMiddleware(returnTrue, middlewareSpy)(req, res, nextSpy);
    tap.ok(middlewareSpy.calledOnce, 'should call middleware once');
    tap.ok(middlewareSpy.calledWith(req, res), 'should call middleware with req and res');
    tap.strictEqual(typeof middlewareSpy.lastCall.lastArg, 'function', 'should call middleware with a next function');
    tap.ok(nextSpy.calledOnce, 'should call next function once after the middleware');
    tap.end();
  });

  tap.test('when running with with a non matching filter', function (tap) {
    tap.plan(2);

    var nextSpy = sinon.fake();
    var middlewareSpy = sinon.spy((req, res, next) => {
      next();
    });

    requestFilterMiddleware(returnFalse, middlewareSpy)(req, res, nextSpy);
    tap.ok(middlewareSpy.notCalled, 'should not call middleware once');
    tap.ok(nextSpy.calledOnce, 'should call next function once after the middleware');
    tap.end();
  });

  tap.afterEach(function (done) {
    req = null;
    res = null;
    done();
  });

  tap.end();
})
