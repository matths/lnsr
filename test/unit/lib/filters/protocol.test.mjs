import tap from 'tap';
import httpMocks from 'node-mocks-http';
import protocol from '../../../../lib/filters/protocol.mjs';

tap.test('protocol filter module', tap => {
  
  tap.test('when created', tap => {
    tap.plan(2);

    tap.notOk(protocol(), 'should return false when no protocol is specified');
    tap.equal(typeof protocol('http'), 'function', 'should return a function');

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

    tap.ok(protocol('https')(req), 'should match protocol');
    tap.notOk(protocol('http')(req), 'should not match protocol');

    tap.end();
  });

  tap.test('when using with differnet protocols as a filter function for plain request', tap => {
    tap.plan(2);

    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/'
    });

    tap.notOk(protocol('https')(req), 'should not match protocol');
    tap.ok(protocol('http')(req), 'should match protocol');

    tap.end();
  });

  tap.end();
});
