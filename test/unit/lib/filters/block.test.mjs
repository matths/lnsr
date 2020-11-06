import tap from 'tap';
import httpMocks from 'node-mocks-http';
import block from '../../../../lib/filters/block.mjs';

tap.test('filter module', tap => {
  let req;
  
  tap.beforeEach(done => {
    req = httpMocks.createRequest({
      method: 'GET',
      url: '/user/Bob',
    });
    done();
  });

  tap.test('when created block filter', tap => {
    tap.plan(1);
    const filter = block('Bob');
    filter(req);
    tap.true(typeof filter === 'function', 'should return a function');
    tap.end();
  });

  tap.test('when running block filter', tap => {
    tap.plan(2);
    tap.false(block('Alice')(req), 'should return false with parameters');
    tap.false(block()(req), 'should return false without parameters');
    tap.end();
  });

  tap.afterEach(done => {
    req = null;
    done();
  });

  tap.end();
});
