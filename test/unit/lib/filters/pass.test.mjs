import tap from 'tap';
import httpMocks from 'node-mocks-http';
import passFilter from '../../../../lib/filters/pass.mjs';

tap.test('filter module', tap => {
  let req;
  
  tap.beforeEach(done => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/user/Bob',
    });
    done();
  });

  tap.test('when created passFilter filter', tap => {
    tap.plan(1);
    const filter = passFilter('Bob');
    filter(req);
    tap.true(typeof filter === 'function', 'should return a function');
    tap.end();
  });

  tap.test('when running passFilter filter', tap => {
    tap.plan(2);
    tap.true(passFilter('Alice')(req), 'should return true with parameters');
    tap.true(passFilter()(req), 'should return true without parameters');
    tap.end();
  });

  tap.afterEach(done => {
    req = null;
    done();
  });

  tap.end();
});
