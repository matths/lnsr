var tap = require('tap');
var sinon = require('sinon');
var httpMocks = require('node-mocks-http');

var error = require('../../../lib/error');

tap.test('error middleware module', function (tap) {
  var req, res;
  
  tap.beforeEach(function (done) {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      params: {}
    });

    res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    done();
  });

  tap.test('when created', function (tap) {
    tap.plan(2);
    var errorMiddleware = error();

    tap.strictEqual(typeof errorMiddleware, 'function', 'should return a middleware function');
    tap.strictEqual(errorMiddleware.length, 3, 'that excepts three arguments by default');
    tap.end();
  });

  tap.test('when returned middleware function is used with a custom error handler', function (tap) {
    tap.plan(2);
    var customError = sinon.fake();
    var nextSpy = sinon.spy(function (req, res, next) {});

    var errorMiddleware = error(customError);
    errorMiddleware(req, res, nextSpy);

    tap.ok(nextSpy.calledOnce, 'should call next');
    tap.strictEqual(customError, req.error, 'should have set req.error');
    tap.end();
  });

  tap.test('when returned middleware function is used without a custom error handler', function (tap) {
    tap.plan(2);
    var nextSpy = sinon.spy(function (req, res, next) {});

    var errorMiddleware = error();
    errorMiddleware(req, res, nextSpy);

    tap.ok(nextSpy.calledOnce, 'should call next');
    tap.notOk(req.error, 'should not have set req.error');
    tap.end();
  });

  tap.afterEach(function (done) {
    req = null;
    res = null;
    done();
  });

  tap.end();
})
