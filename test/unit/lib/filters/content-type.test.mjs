import tap from 'tap';
import httpMocks from 'node-mocks-http';
import contentTypeFilter from '../../../../lib/filters/content-type.mjs';

tap.test('content-type filter module', tap => {
  
  tap.test('when created', tap => {
    tap.plan(2);

    tap.false(contentTypeFilter(), 'should return false when no content-type is specified');
    tap.strictEqual(typeof contentTypeFilter('text/plain'), 'function', 'should return a function');

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

    tap.true(contentTypeFilter('text/plain')(req), 'should match content-type');
    tap.false(contentTypeFilter('text/html')(req), 'should not match content-type');

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

    tap.true(contentTypeFilter(['text/plain', 'text/html'])(req), 'should match content-type');
    tap.false(contentTypeFilter(['application/json', 'text/javascript'])(req), 'should not match content-type');

    tap.end();
  });

  tap.test('when client is not sending content-type header', tap => {
    tap.plan(2);

    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/'
    });

    tap.false(contentTypeFilter('text/plain')(req), 'should not match content-type');
    tap.false(contentTypeFilter(['application/json', 'text/javascript'])(req), 'should not match content-type');

    tap.end();
  });

  tap.end();
})
