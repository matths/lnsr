import { EventEmitter } from 'events';
import tap from 'tap';
import sinon from 'sinon';
import httpMocks from 'node-mocks-http';
import authorize from '../../../../lib/interact/authorize.mjs';

tap.test('authoriztion middleware module', tap => {

  tap.test('when created', tap => {
    tap.plan(1);
    const middlewareSpy = sinon.spy((req, res, next) => {
      next();
    });
    tap.equal(typeof authorize({}, middlewareSpy), 'function', 'should return a middleware function');
    tap.end();
  });

  tap.test('when running without a authorization header', tap => {
    tap.plan(3);

    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/user/Bob',
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });
    res.on('finish', () => {
      tap.equal(res.statusCode, 401, 'returns 401');
    });

    const nextSpy = sinon.fake();
    const middlewareSpy = sinon.spy((req, res, next) => {
      next();
    });

    authorize({users: { agent007: 'top-secret' }, realm: 'Keep out area!'}, middlewareSpy)(req, res, nextSpy);
    tap.equal(middlewareSpy.callCount, 0, 'should not call middleware');
    tap.equal(nextSpy.callCount, 0, 'should not call next');
    tap.end();
  });

  tap.test('when running with a authorization header but existing user but wrong password', tap => {
    tap.plan(3);

    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/user/Bob',
      headers: {
        authorization: 'Basic YWdlbnQwMDc6bGV0LW1lLWluLXBsZWFzZQ=='
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });
    res.on('finish', () => {
      tap.equal(res.statusCode, 401, 'returns 401');
    });

    const nextSpy = sinon.fake();
    const middlewareSpy = sinon.spy((req, res, next) => {
      next();
    });

    authorize({users: { agent007: 'top-secret' }, realm: 'Keep out area!'}, middlewareSpy)(req, res, nextSpy);
    tap.equal(middlewareSpy.callCount, 0, 'should not call middleware');
    tap.equal(nextSpy.callCount, 0, 'should not call next');
    tap.end();
  });

  tap.test('when running with a valid authorization header', tap => {
    tap.plan(2);

    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/user/Bob',
      headers: {
        authorization: 'Basic YWdlbnQwMDc6dG9wLXNlY3JldA=='
      }
    });
    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    const nextSpy = sinon.fake();
    const middlewareSpy = sinon.spy((req, res, next) => {
      next();
    });

    authorize({users: { agent007: 'top-secret' }, realm: 'Keep out area!'}, middlewareSpy)(req, res, nextSpy);
    tap.ok(middlewareSpy.calledOnce, 'should call middleware once');
    tap.ok(nextSpy.calledOnce, 'should call next');
    tap.end();
  });

  tap.end();
});
