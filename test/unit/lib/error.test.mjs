import { EventEmitter } from 'events';
import tap from 'tap';
import sinon from 'sinon';
import httpMocks from 'node-mocks-http';
import error from '../../../lib/error';

tap.test('error middleware module', tap => {
  let req, res;
  
  tap.beforeEach(done => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      params: {}
    });

    res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    done();
  });

  tap.test('when created', tap => {
    tap.plan(2);
    const errorMiddleware = error();

    tap.strictEqual(typeof errorMiddleware, 'function', 'should return a middleware function');
    tap.strictEqual(errorMiddleware.length, 3, 'that excepts three arguments by default');
    tap.end();
  });

  tap.test('when returned middleware function is used with a custom error handler', tap => {
    tap.plan(2);
    const customError = sinon.fake();
    const nextSpy = sinon.spy(() => {});

    const errorMiddleware = error(customError);
    errorMiddleware(req, res, nextSpy);

    tap.ok(nextSpy.calledOnce, 'should call next');
    tap.strictEqual(customError, req.error, 'should have set req.error');
    tap.end();
  });

  tap.test('when returned middleware function is used without a custom error handler', tap => {
    tap.plan(2);
    const nextSpy = sinon.spy(() => {});

    const errorMiddleware = error();
    errorMiddleware(req, res, nextSpy);

    tap.ok(nextSpy.calledOnce, 'should call next');
    tap.notOk(req.error, 'should not have set req.error');
    tap.end();
  });

  tap.afterEach(done => {
    req = null;
    res = null;
    done();
  });

  tap.end();
});
