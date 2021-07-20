import tap from 'tap';
import httpMocks from 'node-mocks-http';
import pass from '../../../../lib/filters/pass.mjs';

tap.test('filter module', tap => {
  let req;
  
  tap.beforeEach(() => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/user/Bob',
    });
  });

  tap.test('when created pass filter', tap => {
    tap.plan(1);
    const filter = pass('Bob');
    filter(req);
    tap.ok(typeof filter === 'function', 'should return a function');
    tap.end();
  });

  tap.test('when running pass filter', tap => {
    tap.plan(2);
    tap.ok(pass('Alice')(req), 'should return true with parameters');
    tap.ok(pass()(req), 'should return true without parameters');
    tap.end();
  });

  tap.afterEach(() => {
    req = null;
  });

  tap.end();
});
