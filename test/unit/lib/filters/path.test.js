var tap = require('tap');
var sinon = require('sinon');
var rewire = require('rewire');
var httpMocks = require('node-mocks-http');

var filterPath = rewire('../../../../lib/filters/path');

function spyOnPrivateMethod (methodStr, obj) {
    var method = obj.__get__(methodStr);
    var methodSpy = sinon.spy(method);
    obj.__set__(methodStr, methodSpy);
    return methodSpy;
}

tap.test('method middleware module', function (tap) {
  var req, res;
  
  tap.beforeEach(function (done) {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/user/Bob',
    });
    res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });
    done();
  });

  tap.test('when using the internal split function', function (tap) {
    tap.plan(3);
    var split = filterPath.__get__('split');
    tap.same(split('/aaa/bbb'), ['/aaa', '/bbb'], 'should split string in portions starting with slash');
    tap.false(split('somethingwrong'), 'should return false when string is no path');
    tap.false(split(), 'should return false when there is no string');
    tap.end();
  });

  tap.test('when created without path pattern', function (tap) {
    tap.plan(2);
    var splitSpy = spyOnPrivateMethod('split', filterPath);
    var filterPathMiddleware = filterPath();
    tap.ok(splitSpy.called, 'should run through split');
    tap.false(filterPathMiddleware, 'should return false');
    tap.end();
  });

  tap.test('when created with valid path pattern', function (tap) {
    tap.plan(2);
    var filterPathMiddleware = filterPath('/user/:user-id');
    tap.strictEqual(typeof filterPathMiddleware, 'function', 'should return a middleware function');
    tap.strictEqual(filterPathMiddleware.length, 3, 'that excepts three arguments by default');
    tap.end();
  });

  tap.test('when used with valid path pattern and middleware function', function (tap) {
    tap.plan(5);
    var matchSpy = spyOnPrivateMethod('match', filterPath);
    var nextSpy = sinon.fake();
    var middlewareSpy = sinon.spy(function (req, res, next) {
      next();
    });

    var filterPathMiddleware = filterPath('/user/:user-id', middlewareSpy);
    filterPathMiddleware(req, res, nextSpy);

    tap.ok(matchSpy.called, 'should run through match');
    tap.ok(middlewareSpy.calledOnce, 'should not call middleware once');
    tap.ok(middlewareSpy.calledWith(req, res), 'should call middleware with req and res');
    tap.strictEqual(typeof middlewareSpy.lastCall.lastArg, 'function', 'should call middleware with a next function');
    tap.ok(nextSpy.calledOnce, 'should call next once after the middleware');
    tap.end();
  });

  tap.test('when used with valid path pattern and middleware function and no params object', function (tap) {
    tap.plan(5);
    delete req['params'];
    var matchSpy = spyOnPrivateMethod('match', filterPath);
    var nextSpy = sinon.fake();
    var middlewareSpy = sinon.spy(function (req, res, next) {
      next();
    });

    var filterPathMiddleware = filterPath('/user/:user-id', middlewareSpy);
    filterPathMiddleware(req, res, nextSpy);

    tap.ok(matchSpy.called, 'should run through match');
    tap.ok(middlewareSpy.calledOnce, 'should not call middleware once');
    tap.ok(middlewareSpy.calledWith(req, res), 'should call middleware with req and res');
    tap.strictEqual(typeof middlewareSpy.lastCall.lastArg, 'function', 'should call middleware with a next function');
    tap.ok(nextSpy.calledOnce, 'should call next once after the middleware');
    tap.end();
  });

  tap.test('when used with longer path pattern than request path', function (tap) {
    tap.plan(3);

    var matchSpy = spyOnPrivateMethod('match', filterPath);
    var nextSpy = sinon.fake();
    var middlewareSpy = sinon.spy(function (req, res, next) {
      next();
    });

    var filterPathMiddleware = filterPath('/user/:user-id/book/:book-id', middlewareSpy);
    filterPathMiddleware(req, res, nextSpy);

    tap.ok(matchSpy.called, 'should run through match');
    tap.ok(middlewareSpy.notCalled, 'should not call middleware');
    tap.ok(nextSpy.calledOnce, 'should call next');
    tap.end();
  });

  tap.test('when used with longer empty request path', function (tap) {
    tap.plan(2);
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/',
    });

    var nextSpy = sinon.fake();
    var middlewareSpy = sinon.spy(function (req, res, next) {
      next();
    });

    var filterPathMiddleware = filterPath('/user/:user-id', middlewareSpy);
    filterPathMiddleware(req, res, nextSpy);

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
