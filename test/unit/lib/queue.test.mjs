import tap from 'tap';
import sinon from 'sinon';
import httpMocks from 'node-mocks-http';
import { EventEmitter } from 'events';
import queue from '../../../lib/queue.mjs';

tap.test('queue middleware module', tap => {
  let req, res;
  
  tap.beforeEach(() => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      params: {}
    });

    res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

  });

  tap.test('when created', tap => {
    tap.plan(2);
    const queueMiddleware = queue();

    tap.equal(typeof queueMiddleware, 'function', 'should return a middleware function');
    tap.equal(queueMiddleware.length, 3, 'that excepts three arguments by default');
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
    tap.equal(typeof middlewareSpy.lastCall.lastArg, 'function', 'should call middleware with a next function');
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
    const endSpy = sinon.spy(res.end);
    res.end = endSpy;
    const queueMiddleware = queue(badMiddlewareSpy);
    queueMiddleware(req, res);
    tap.ok(badMiddlewareSpy.calledOnce, 'should call error middleware once');
    tap.ok(endSpy.calledOnce, 'should call res.end once');
    tap.end();
  });

  tap.test('when used with a middleware throwing an error/exception', tap => {
    tap.plan(2);
    const badMiddlewareSpy = sinon.spy(() => {
      throw new Error('something went wrong.');
    });
    const endSpy = sinon.spy(res.end);
    res.end = endSpy;
    const queueMiddleware = queue(badMiddlewareSpy);
    queueMiddleware(req, res);
    tap.ok(badMiddlewareSpy.calledOnce, 'should call error middleware once');
    tap.ok(endSpy.calledOnce, 'should call res.end once');
    tap.end();
  });

  tap.test('when used with an error middleware and a custom req.error function', tap => {
    tap.plan(4);
    req.error = sinon.spy(() => {});
    const errMsg = 'something bad happend.';
    const badMiddlewareSpy = sinon.spy((req, res, next) => {
      next(errMsg);
    });
    const endSpy = sinon.spy(res.end);
    res.end = endSpy;
    const queueMiddleware = queue(badMiddlewareSpy);
    queueMiddleware(req, res);
    tap.ok(badMiddlewareSpy.calledOnce, 'should call error middleware once');
    tap.ok(endSpy.notCalled, 'should not call res.end');
    tap.ok(req.error.calledOnce, 'should call custom error function');    
    tap.ok(req.error.lastCall.args[0] === errMsg, 'should call custom error function with error message as first argument');    
    tap.end();
  });

  tap.test('when used without a middleware', tap => {
    tap.plan(1);
    const endSpy = sinon.spy(res.end);
    res.end = endSpy;
    const queueMiddleware = queue();
    queueMiddleware(req, res);
    tap.ok(endSpy.calledOnce, 'should call res.end once');
    tap.end();
  });

  tap.afterEach(() => {
    req = null;
    res = null;
  });

  tap.end();
});
