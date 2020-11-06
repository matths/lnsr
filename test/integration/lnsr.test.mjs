import EventEmitter from 'events';
import tap from 'tap';
import sinon from 'sinon';
import httpMocks from 'node-mocks-http';
import {get, post, path} from '../../lib/lnsr';

tap.test('lnsr library', tap => {
  let req, res, middlewareSpy, nextSpy;
  
  tap.beforeEach(done => {
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

    nextSpy = sinon.spy((req, res, next) => {});

    done();
  });

  tap.test('when using get shortcut', tap => {
    tap.plan(2);
    const mw = get('/user/:username', middlewareSpy);
    mw(req, res, nextSpy);
    tap.strictEqual(typeof mw, 'function', 'should return a middleware function');
    tap.strictEqual(middlewareSpy.callCount, 0, 'should not call middleware');
    tap.end();
  });

  tap.test('when using post shortcut', tap => {
    tap.plan(2);
    const mw = post('/user/:username', middlewareSpy);
    mw(req, res, nextSpy);
    tap.strictEqual(typeof mw, 'function', 'should return a middleware function');
    tap.strictEqual(middlewareSpy.callCount, 0, 'should not call middleware');
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
    tap.strictEqual(typeof mw, 'function', 'should return a middleware function');
    tap.true(middlewareSpy.calledOnce, 'should call middleware');
    tap.end();
  });

  tap.afterEach(done => {
    req = null;
    res = null;
    done();
  });

  tap.end();
})
