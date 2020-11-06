import { EventEmitter } from 'events';
import tap from 'tap';
import sinon from 'sinon';
import httpMocks from 'node-mocks-http';
import filterMiddleware from '../../../lib/filter';

tap.test('request filter middleware module', tap => {
  let req, res, returnTrue, returnFalse;
  
  tap.beforeEach(done => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/user/Bob',
    });
    res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });
    returnTrue = () => true;
    returnFalse = () => false;
    done();
  });

  tap.test('when created', tap => {
    tap.plan(1);

    const middleware = (req, res, next) => {
      next();
    };

    tap.strictEqual(typeof filterMiddleware(returnTrue, middleware), 'function', 'should return a middleware function');
    tap.end();
  });

  tap.test('when running without a filter function', tap => {
    tap.plan(2);

    const nextSpy = sinon.fake();
    const middlewareSpy = sinon.spy((req, res, next) => {
      next();
    });

    filterMiddleware(false, middlewareSpy)(req, res, nextSpy);
    tap.strictEqual(middlewareSpy.callCount, 0, 'should not call middleware');
    tap.ok(nextSpy.calledOnce, 'should call next function');
    tap.end();
  });


  tap.test('when running with with a matching filter', tap => {
    tap.plan(4);

    const nextSpy = sinon.fake();
    const middlewareSpy = sinon.spy((req, res, next) => {
      next();
    });

    filterMiddleware(returnTrue, middlewareSpy)(req, res, nextSpy);
    tap.ok(middlewareSpy.calledOnce, 'should call middleware once');
    tap.ok(middlewareSpy.calledWith(req, res), 'should call middleware with req and res');
    tap.strictEqual(typeof middlewareSpy.lastCall.lastArg, 'function', 'should call middleware with a next function');
    tap.ok(nextSpy.calledOnce, 'should call next function once after the middleware');
    tap.end();
  });

  tap.test('when running with with a non matching filter', tap => {
    tap.plan(2);

    const nextSpy = sinon.fake();
    const middlewareSpy = sinon.spy((req, res, next) => {
      next();
    });

    filterMiddleware(returnFalse, middlewareSpy)(req, res, nextSpy);
    tap.ok(middlewareSpy.notCalled, 'should not call middleware once');
    tap.ok(nextSpy.calledOnce, 'should call next function once after the middleware');
    tap.end();
  });

  tap.test('when running with multiple matching filters', tap => {
    tap.plan(4);

    const nextSpy = sinon.fake();
    const middlewareSpy = sinon.spy((req, res, next) => {
      next();
    });

    filterMiddleware([returnTrue, returnTrue], middlewareSpy)(req, res, nextSpy);
    tap.ok(middlewareSpy.calledOnce, 'should call middleware once');
    tap.ok(middlewareSpy.calledWith(req, res), 'should call middleware with req and res');
    tap.strictEqual(typeof middlewareSpy.lastCall.lastArg, 'function', 'should call middleware with a next function');
    tap.ok(nextSpy.calledOnce, 'should call next function once after the middleware');
    tap.end();
  });
  
  tap.test('when running with a matching and a non matching filter', tap => {
    tap.plan(2);

    const nextSpy = sinon.fake();
    const middlewareSpy = sinon.spy((req, res, next) => {
      next();
    });

    filterMiddleware([returnTrue, returnFalse], middlewareSpy)(req, res, nextSpy);
    tap.ok(middlewareSpy.notCalled, 'should not call middleware once');
    tap.ok(nextSpy.calledOnce, 'should call next function once after the middleware');
    tap.end();
  });

  tap.afterEach(done => {
    req = null;
    res = null;
    done();
  });

  tap.end();
});
