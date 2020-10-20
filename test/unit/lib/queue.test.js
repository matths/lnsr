const tap = require('tap');
const sinon = require('sinon');
const rewire = require('rewire');
const httpMocks = require('node-mocks-http');

const queue = rewire('../../../lib/queue');

const spyOnPrivateMethod = (methodStr, obj) => {
    const method = obj.__get__(methodStr);
    const methodSpy = sinon.spy(method);
    obj.__set__(methodStr, methodSpy);
    return methodSpy;
}

tap.test('queue middleware module', tap => {
  let req, res;
  
  tap.beforeEach(done => {
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

  tap.test('when created', tap => {
    tap.plan(2);
    const queueMiddleware = queue();

    tap.strictEqual(typeof queueMiddleware, 'function', 'should return a middleware function');
    tap.strictEqual(queueMiddleware.length, 3, 'that excepts three arguments by default');
    tap.end();
  });

  tap.test('when returned middleware function is used', tap => {
    tap.plan(2);
    const executeSpy = spyOnPrivateMethod('execute', queue);
    const emptySpy = spyOnPrivateMethod('empty', queue);

    const queueMiddleware = queue();
    queueMiddleware(req, res);

    tap.ok(executeSpy.called, 'should call internal execute function');
    tap.ok(executeSpy.called, 'should call internal empty function');
    tap.end();
  });

  tap.test('when used with a single middleware as argument', tap => {
    tap.plan(4);
    const middlewareSpy = sinon.spy((req, res, next) => {
      next();
    });
    const nextSpy = sinon.fake();
    const queueMiddleware = queue(middlewareSpy);
    queueMiddleware(req, res, nextSpy);
    tap.ok(middlewareSpy.calledOnce, 'should call middleware once');
    tap.ok(middlewareSpy.calledWith(req, res), 'should call middleware with req and res');
    tap.ok(nextSpy.calledOnce, 'should call inital next middleware');
    tap.strictEqual(typeof middlewareSpy.lastCall.lastArg, 'function', 'should call middleware with a next function');
    tap.end();
  });

  tap.test('when used with mutliple middleware functions as arguments', tap => {
    tap.plan(4);
    const middlewareSpy1 = sinon.fake((a1, a2, next) => { next(); });
    const middlewareSpy2 = sinon.fake(() => {});
    const queueMiddleware = queue(middlewareSpy1, middlewareSpy2);
    queueMiddleware(req, res);
    tap.ok(middlewareSpy1.calledOnce, 'should call middleware1 once');
    tap.ok(middlewareSpy1.calledWith(req, res), 'should call middleware1 with req and res');
    tap.ok(middlewareSpy2.calledOnce, 'should call middleware2 once');
    tap.ok(middlewareSpy2.calledWith(req, res), 'should call middleware2 with req and res');
    tap.end();
  });

  tap.test('when used with an array of mutliple middleware functions as a single argument', tap => {
    tap.plan(4);
    const middlewareSpy1 = sinon.fake((a1, a2, next) => { next(); });
    const middlewareSpy2 = sinon.fake(() => {});
    const queueMiddleware = queue([middlewareSpy1, middlewareSpy2]);
    queueMiddleware(req, res);
    tap.ok(middlewareSpy1.calledOnce, 'should call middleware1 once');
    tap.ok(middlewareSpy1.calledWith(req, res), 'should call middleware1 with req and res');
    tap.ok(middlewareSpy2.calledOnce, 'should call middleware2 once');
    tap.ok(middlewareSpy2.calledWith(req, res), 'should call middleware2 with req and res');
    tap.end();
  });

  tap.test('when used with an error middleware', tap => {
    tap.plan(2);
    const badMiddlewareSpy = sinon.spy((req, res, next) => {
      next('something bad happend.');
    });
    const error = queue.__get__('error');
    const errorSpy = sinon.spy(error);
    queue.__set__('error', errorSpy);
    const queueMiddleware = queue(badMiddlewareSpy);
    queueMiddleware(req, res);
    tap.ok(badMiddlewareSpy.calledOnce, 'should call error middleware once');
    tap.ok(errorSpy.calledOnce, 'should call internal error once');
    tap.end();
  });

  tap.test('when used with a middleware throwing an error/exception', tap => {
    tap.plan(2);
    const badMiddlewareSpy = sinon.spy((req, res, next) => {
      throw new Error("something went wrong.");
      next();
    });
    const error = queue.__get__('error');
    const errorSpy = sinon.spy(error);
    queue.__set__('error', errorSpy);
    const queueMiddleware = queue(badMiddlewareSpy);
    queueMiddleware(req, res);
    tap.ok(badMiddlewareSpy.calledOnce, 'should call error middleware once');
    tap.ok(errorSpy.calledOnce, 'should call internal error once');
    tap.end();
  });

  tap.test('when used with an error middleware and a custom req.error function', tap => {
    tap.plan(4);
    req.error = sinon.spy((err, req, res, next) => {});
    const errMsg = 'something bad happend.';
    const badMiddlewareSpy = sinon.spy((req, res, next) => {
      next(errMsg);
    });
    const error = queue.__get__('error');
    const errorSpy = sinon.spy(error);
    queue.__set__('error', errorSpy);
    const queueMiddleware = queue(badMiddlewareSpy);
    queueMiddleware(req, res);
    tap.ok(badMiddlewareSpy.calledOnce, 'should call error middleware once');
    tap.ok(errorSpy.notCalled, 'should not call internal error once');
    tap.ok(req.error.calledOnce, 'should call custom error function');    
    tap.ok(req.error.lastCall.args[0] === errMsg, 'should call custom error function with error message as first argument');    
    tap.end();
  });

  tap.afterEach(done => {
    req = null;
    res = null;
    done();
  });

  tap.end();
})
