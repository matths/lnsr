import tap from 'tap';
import httpMocks from 'node-mocks-http';
import method from '../../../../lib/filters/method.mjs';

tap.test('method filter module',  tap => {
  
  tap.test('when created', tap => {
    tap.plan(5);

    tap.notOk(method(), 'should return false when created without method');
    tap.notOk(method('UGLIFY'), 'should return false when created without valid method');
    tap.equal(typeof method('GET'), 'function', 'should return a function when created with valid one valid method');
    tap.equal(typeof method(['GET', 'POST']), 'function', 'should return a function when created with an array of valid methods');
    tap.equal(typeof method(['GET', 'UGLIFY']), 'function','should return a function when created without a single valid method');

    tap.end();
  });

  tap.test('when using with different method names as filter function', tap => {
    tap.plan(3);

    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/',
    });
  
    tap.ok(method('GET')(req), 'should match single uppercase method');
    tap.ok(method('Get')(req), 'should match single mixed case method');
    tap.ok(method(['GET', 'POST'])(req), 'should match a method from list');

    tap.end();
  });

  tap.end();
});
