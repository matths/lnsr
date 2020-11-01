import tap from 'tap';
import httpMocks from 'node-mocks-http';
import hostnameFilter from '../../../../lib/filters/host';

tap.test('host filter module', tap => {
  
  tap.test('when created', tap => {
    tap.plan(2);

    tap.false(hostnameFilter(), 'should return false when no hostname is specified');
    tap.strictEqual(typeof hostnameFilter('test-a.com'), 'function', 'should return a function');

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

    tap.true(hostnameFilter('test-a.com')(req), 'should match hostname');
    tap.false(hostnameFilter('test-b.com')(req), 'should not match hostname');

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

    tap.false(hostnameFilter('test-a.com')(req), 'should not match hostname');

    tap.end();
  });

  tap.end();
});
