import tap from 'tap';
import httpMocks from 'node-mocks-http';
import contentType from '../../../../lib/filters/content-type.mjs';

tap.test('content-type filter module', tap => {
  
  tap.test('when created', tap => {
    tap.plan(2);

    tap.notOk(contentType(), 'should return false when no content-type is specified');
    tap.equal(typeof contentType('text/plain'), 'function', 'should return a function');

    tap.end();
  });

  tap.test('when using with a content-type as a filter function', tap => {
    tap.plan(2);

    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      headers: {
        'content-type': 'text/plain'
      }
    });

    tap.ok(contentType('text/plain')(req), 'should match content-type');
    tap.notOk(contentType('text/html')(req), 'should not match content-type');

    tap.end();
  });

  tap.test('when using with multiple content-types as a filter function', tap => {
    tap.plan(2);

    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      headers: {
        'content-type': 'text/plain'
      }
    });

    tap.ok(contentType(['text/plain', 'text/html'])(req), 'should match content-type');
    tap.notOk(contentType(['application/json', 'text/javascript'])(req), 'should not match content-type');

    tap.end();
  });

  tap.test('when client is not sending content-type header', tap => {
    tap.plan(2);

    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/'
    });

    tap.notOk(contentType('text/plain')(req), 'should not match content-type');
    tap.notOk(contentType(['application/json', 'text/javascript'])(req), 'should not match content-type');

    tap.end();
  });

  tap.end();
});
