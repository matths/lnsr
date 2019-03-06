var tap = require('tap');
var sinon = require('sinon');
var rewire = require('rewire');
var httpMocks = require('node-mocks-http');

var queue = rewire('../../../lib/queue');

function spyOnPrivateMethod (methodStr, obj) {
    var method = obj.__get__(methodStr);
    var methodSpy = sinon.spy(method);
    obj.__set__(methodStr, methodSpy);
    return methodSpy;
}

tap.test('queue middleware module', function (tap) {
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
    var queueMiddleware = queue();

    tap.strictEqual(typeof queueMiddleware, 'function', 'should return a middleware function');
    tap.strictEqual(queueMiddleware.length, 3, 'that excepts three arguments by default');
    tap.end();
  });

  tap.test('when returned middleware function is used', function (tap) {
    tap.plan(2);
    var executeSpy = spyOnPrivateMethod('execute', queue);
    var emptySpy = spyOnPrivateMethod('empty', queue);

    var queueMiddleware = queue();
    queueMiddleware(req, res);

    tap.ok(executeSpy.called, 'should call internal execute function');
    tap.ok(executeSpy.called, 'should call internal empty function');
    tap.end();
  });

  tap.test('when used with a single middleware as argument', function (tap) {
    tap.plan(4);
    var middlewareSpy = sinon.spy(function (req, res, next) {
      next();
    });
    var nextSpy = sinon.fake();
    var queueMiddleware = queue(middlewareSpy);
    queueMiddleware(req, res, nextSpy);
    tap.ok(middlewareSpy.calledOnce, 'should call middleware once');
    tap.ok(middlewareSpy.calledWith(req, res), 'should call middleware with req and res');
    tap.ok(nextSpy.calledOnce, 'should call inital next middleware');
    tap.strictEqual(typeof middlewareSpy.lastCall.lastArg, 'function', 'should call middleware with a next function');
    tap.end();
  });

  tap.test('when used with mutliple middleware functions as arguments', function (tap) {
    tap.plan(4);
    var middlewareSpy1 = sinon.fake(function (a1, a2, next) { next(); });
    var middlewareSpy2 = sinon.fake(function () {});
    var queueMiddleware = queue(middlewareSpy1, middlewareSpy2);
    queueMiddleware(req, res);
    tap.ok(middlewareSpy1.calledOnce, 'should call middleware1 once');
    tap.ok(middlewareSpy1.calledWith(req, res), 'should call middleware1 with req and res');
    tap.ok(middlewareSpy2.calledOnce, 'should call middleware2 once');
    tap.ok(middlewareSpy2.calledWith(req, res), 'should call middleware2 with req and res');
    tap.end();
  });

  tap.test('when used with an array of mutliple middleware functions as a single argument', function (tap) {
    tap.plan(4);
    var middlewareSpy1 = sinon.fake(function (a1, a2, next) { next(); });
    var middlewareSpy2 = sinon.fake(function () {});
    var queueMiddleware = queue([middlewareSpy1, middlewareSpy2]);
    queueMiddleware(req, res);
    tap.ok(middlewareSpy1.calledOnce, 'should call middleware1 once');
    tap.ok(middlewareSpy1.calledWith(req, res), 'should call middleware1 with req and res');
    tap.ok(middlewareSpy2.calledOnce, 'should call middleware2 once');
    tap.ok(middlewareSpy2.calledWith(req, res), 'should call middleware2 with req and res');
    tap.end();
  });

  tap.test('when used with an error middleware', function (tap) {
    tap.plan(2);
    var badMiddlewareSpy = sinon.spy(function (req, res, next) {
      next('something bad happend.');
    });
    var error = queue.__get__('error');
    var errorSpy = sinon.spy(error);
    queue.__set__('error', errorSpy);
    var queueMiddleware = queue(badMiddlewareSpy);
    queueMiddleware(req, res);
    tap.ok(badMiddlewareSpy.calledOnce, 'should call error middleware once');
    tap.ok(errorSpy.calledOnce, 'should call internal error once');
    tap.end();
  });

  tap.test('when used with an error middleware and a custom req.error function', function (tap) {
    tap.plan(4);
    req.error = sinon.spy(function (err, req, res, next) {});
    var errMsg = 'something bad happend.';
    var badMiddlewareSpy = sinon.spy(function (req, res, next) {
      next(errMsg);
    });
    var error = queue.__get__('error');
    var errorSpy = sinon.spy(error);
    queue.__set__('error', errorSpy);
    var queueMiddleware = queue(badMiddlewareSpy);
    queueMiddleware(req, res);
    tap.ok(badMiddlewareSpy.calledOnce, 'should call error middleware once');
    tap.ok(errorSpy.notCalled, 'should not call internal error once');
    tap.ok(req.error.calledOnce, 'should call custom error function');    
    tap.ok(req.error.lastCall.args[0] === errMsg, 'should call custom error function with error message as first argument');    
    tap.end();
  });

  tap.afterEach(function (done) {
    req = null;
    res = null;
    done();
  });

  tap.end();
})
