var tap = require('tap');
var sinon = require('sinon');
var httpMocks = require('node-mocks-http');
var hostnameFilter = require('../../../../lib/filters/host');

tap.test('host filter module', function (tap) {
  
  tap.beforeEach(function (done) {
    done();
  });

  tap.test('when created', function (tap) {
    tap.plan(2);
    tap.false(hostnameFilter(), 'should return false when no hostname is specified');
    tap.strictEqual(typeof hostnameFilter('test-a.com'), 'function', 'should return a function');
    tap.end();
  });

  tap.test('when using with differnet hostnames as a filter function', function (tap) {
    tap.plan(2);

    var req = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      headers: {
        host: 'test-a.com'
      },
      params: {}
    });

    tap.true(hostnameFilter('test-a.com')(req), 'should match hostname');
    tap.false(hostnameFilter('test-b.com')(req), 'should not match hostname');
    tap.end();
  });


  tap.test('when using but no there is no hostname in header', function (tap) {
    tap.plan(1);

    var req = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      headers: {},
      params: {}
    });

    tap.false(hostnameFilter('test-a.com')(req), 'should not match hostname');
    tap.end();
  });

  tap.afterEach(function (done) {
    req = null;
    res = null;
    done();
  });

  tap.end();
})
