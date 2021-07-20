import tap from 'tap';
import httpMocks from 'node-mocks-http';
import host from '../../../../lib/filters/host.mjs';

tap.test('host filter module', tap => {
  
  tap.test('when created', tap => {
    tap.plan(2);

    tap.notOk(host(), 'should return false when no hostname is specified');
    tap.equal(typeof host('test-a.com'), 'function', 'should return a function');

    tap.end();
  });

  tap.test('when using with differnet hostnames as a filter function', tap => {
    tap.plan(2);

    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      headers: {
        host: 'test-a.com'
      },
      params: {}
    });

    tap.ok(host('test-a.com')(req), 'should match hostname');
    tap.notOk(host('test-b.com')(req), 'should not match hostname');

    tap.end();
  });


  tap.test('when using but no there is no hostname in header', tap => {
    tap.plan(1);

    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      headers: {},
      params: {}
    });

    tap.notOk(host('test-a.com')(req), 'should not match hostname');

    tap.end();
  });

  tap.end();
});
