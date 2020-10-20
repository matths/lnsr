const tap = require('tap');
const rewire = require('rewire');
const httpMocks = require('node-mocks-http');

const urlMatchString = rewire('../../../../lib/filters/urlMatchString');

tap.test('filter module', tap => {
  let req;
  
  tap.beforeEach(done => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/user/Bob',
    });
    done();
  });

  tap.test('when created urlMatchString filter', tap => {
    tap.plan(1);
    const urlMatchStringFilter = urlMatchString('Bob');
    urlMatchStringFilter(req);
    tap.true(typeof urlMatchStringFilter === "function", 'should return a function');
    tap.end();
  });

  tap.test('when running different urlMatchString filter', tap => {
    tap.plan(2);
    tap.false(urlMatchString('Alice')(req), 'Alice is not in mock URL path');
    tap.true(urlMatchString('Bob')(req), 'Bob is in mock URL path');
    tap.end();
  });

  tap.afterEach(done => {
    req = null;
    done();
  });

  tap.end();
})
