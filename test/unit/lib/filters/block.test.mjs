import tap from 'tap';
import httpMocks from 'node-mocks-http';
import blockFilter from '../../../../lib/filters/block';

tap.test('filter module', tap => {
  let req;
  
  tap.beforeEach(done => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/user/Bob',
    });
    done();
  });

  tap.test('when created blockFilter filter', tap => {
    tap.plan(1);
    const filter = blockFilter('Bob');
    filter(req);
    tap.true(typeof filter === "function", 'should return a function');
    tap.end();
  });

  tap.test('when running blockFilter filter', tap => {
    tap.plan(2);
    tap.false(blockFilter('Alice')(req), 'should return false with parameters');
    tap.false(blockFilter()(req), 'should return false without parameters');
    tap.end();
  });

  tap.afterEach(done => {
    req = null;
    done();
  });

  tap.end();
})
