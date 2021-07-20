import EventEmitter from 'events';
import tap from 'tap';
import sinon from 'sinon';
import httpMocks from 'node-mocks-http';
import {get, post, path} from '../../lib/lnsr.mjs';

tap.test('lnsr library', tap => {
  let req, res, middlewareSpy, nextSpy;
  
  tap.beforeEach(() => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      params: {}
    });

    res = httpMocks.createResponse({
      eventEmitter: EventEmitter
    });

    middlewareSpy = sinon.spy((req, res, next) => {
      next();
    });

    nextSpy = sinon.spy(() => {});
  });

  tap.test('when using get shortcut', tap => {
    tap.plan(2);
    const mw = get('/user/:username', middlewareSpy);
    mw(req, res, nextSpy);
    tap.equal(typeof mw, 'function', 'should return a middleware function');
    tap.equal(middlewareSpy.callCount, 0, 'should not call middleware');
    tap.end();
  });

  tap.test('when using post shortcut', tap => {
    tap.plan(2);
    const mw = post('/user/:username', middlewareSpy);
    mw(req, res, nextSpy);
    tap.equal(typeof mw, 'function', 'should return a middleware function');
    tap.equal(middlewareSpy.callCount, 0, 'should not call middleware');
    tap.end();
  });

  tap.test('when using path middleware', tap => {
    tap.plan(2);
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/user/Bob'
    });

    const mw = path('/user/:username', middlewareSpy);
    mw(req, res, nextSpy);
    tap.equal(typeof mw, 'function', 'should return a middleware function');
    tap.ok(middlewareSpy.calledOnce, 'should call middleware');
    tap.end();
  });

  tap.afterEach(() => {
    req = null;
    res = null;
  });

  tap.end();
});
