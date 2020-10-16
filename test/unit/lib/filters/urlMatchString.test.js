var tap = require('tap');
var sinon = require('sinon');
var rewire = require('rewire');
var httpMocks = require('node-mocks-http');

var urlMatchString = rewire('../../../../lib/filters/urlMatchString');

function spyOnPrivateMethod (methodStr, obj) {
    var method = obj.__get__(methodStr);
    var methodSpy = sinon.spy(method);
    obj.__set__(methodStr, methodSpy);
    return methodSpy;
}

tap.test('filter module', function (tap) {
  var req;
  
  tap.beforeEach(function (done) {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/user/Bob',
    });
    done();
  });

  tap.test('when created urlMatchString filter', function (tap) {
    tap.plan(1);
    var urlMatchStringFilter = urlMatchString('Bob');
    urlMatchStringFilter(req);
    tap.true(typeof urlMatchStringFilter === "function", 'should return a function');
    tap.end();
  });

  tap.test('when running different urlMatchString filter', function (tap) {
    tap.plan(2);
    tap.false(urlMatchString('Alice')(req), 'Alice is not in mock URL path');
    tap.true(urlMatchString('Bob')(req), 'Bob is in mock URL path');
    tap.end();
  });

  tap.afterEach(function (done) {
    req = null;
    res = null;
    done();
  });

  tap.end();
})
