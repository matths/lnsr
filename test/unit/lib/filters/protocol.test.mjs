import tap from 'tap';
import httpMocks from 'node-mocks-http';
import protocol from '../../../../lib/filters/protocol.mjs';

tap.test('protocol filter module', tap => {
  
  tap.test('when created', tap => {
    tap.plan(2);

    tap.false(protocol(), 'should return false when no protocol is specified');
    tap.strictEqual(typeof protocol('http'), 'function', 'should return a function');

    tap.end();
  });

  tap.test('when using with differnet protocols as a filter function for encrypted request', tap => {
    tap.plan(2);

    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      connection: {
        encrypted: true
      }
    });

    tap.true(protocol('https')(req), 'should match protocol');
    tap.false(protocol('http')(req), 'should not match protocol');

    tap.end();
  });

  tap.test('when using with differnet protocols as a filter function for plain request', tap => {
    tap.plan(2);

    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/'
    });

    tap.false(protocol('https')(req), 'should not match protocol');
    tap.true(protocol('http')(req), 'should match protocol');

    tap.end();
  });

  tap.end();
});
