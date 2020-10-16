const tap = require('tap');
const httpMocks = require('node-mocks-http');
const methodFilter = require('../../../../lib/filters/method');

tap.test('method filter module',  tap => {
  
  tap.test('when created', tap => {
    tap.plan(5);

    tap.false(methodFilter(), 'should return false when created without method');
    tap.false(methodFilter('UGLIFY'), 'should return false when created without invalid method');
    tap.strictEqual(typeof methodFilter('GET'), 'function', 'should return a function when created with valid one valid method');
    tap.strictEqual(typeof methodFilter(['GET', 'POST']), 'function', 'should return a function when created with an array of valid methods');
    tap.strictEqual(typeof methodFilter(['GET', 'UGLIFY']), 'function','should return a function when created without a single valid method');

    tap.end();
  });

  tap.test('when using with different method names as filter function', tap => {
    tap.plan(3);

    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/',
    });
  
    tap.true(methodFilter('GET')(req), 'should match single uppercase method');
    tap.true(methodFilter('Get')(req), 'should match single mixed case method');
    tap.true(methodFilter(['GET', 'POST'])(req), 'should match a method from list');

    tap.end();
  });

  tap.end();
});
