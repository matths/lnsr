import tap from 'tap';
import httpMocks from 'node-mocks-http';
import pass from '../../../../lib/filters/pass.mjs';

tap.test('filter module', tap => {
  let req;
  
  tap.beforeEach(done => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/user/Bob',
    });
    done();
  });

  tap.test('when created pass filter', tap => {
    tap.plan(1);
    const filter = pass('Bob');
    filter(req);
    tap.true(typeof filter === 'function', 'should return a function');
    tap.end();
  });

  tap.test('when running pass filter', tap => {
    tap.plan(2);
    tap.true(pass('Alice')(req), 'should return true with parameters');
    tap.true(pass()(req), 'should return true without parameters');
    tap.end();
  });

  tap.afterEach(done => {
    req = null;
    done();
  });

  tap.end();
});
