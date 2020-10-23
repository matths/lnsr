const tap = require('tap');
const sinon = require('sinon');
const httpMocks = require('node-mocks-http');

const lnsr = require('../../lib/lnsr');

tap.test('lnsr library', tap => {
  let req, res, middlewareSpy, nextSpy;
  
  tap.beforeEach(done => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      params: {}
    });

    res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    middlewareSpy = sinon.spy((req, res, next) => {
      next();
    });

    nextSpy = sinon.spy((req, res, next) => {});

    done();
  });

  tap.test('when using get shortcut', tap => {
    tap.plan(2);
    const mw = lnsr.get('/user/:username', middlewareSpy);
    mw(req, res, nextSpy);
    tap.strictEqual(typeof mw, 'function', 'should return a middleware function');
    tap.true(middlewareSpy.calledOnce, 'should call middleware');
    tap.end();
  });

  tap.test('when using post shortcut', tap => {
    tap.plan(2);
    const mw = lnsr.post('/user/:username', middlewareSpy);
    mw(req, res, nextSpy);
    tap.strictEqual(typeof mw, 'function', 'should return a middleware function');
    tap.strictEqual(middlewareSpy.callCount, 0, 'should not call middleware');
    tap.end();
  });

  tap.afterEach(done => {
    req = null;
    res = null;
    done();
  });

  tap.end();
})
