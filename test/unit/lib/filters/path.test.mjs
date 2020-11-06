import tap from 'tap';
import httpMocks from 'node-mocks-http';
import pathFilter from '../../../../lib/filters/path.mjs';

tap.test('path filter module', tap => {
  
  tap.test('when created', tap => {
    tap.plan(2);
    tap.false(pathFilter(), 'should return false when no path pattern is specified');
    tap.strictEqual(typeof pathFilter('/user/:userid/action/:action'), 'function', 'should return a function');
    tap.end();
  });

  tap.test('when using with differnet pattern as a filter function against different request pathes', tap => {
    tap.plan(6);

    let req;
    req = httpMocks.createRequest({ method: 'GET', params: {}, url: '/'});
    tap.false(pathFilter('/user/:userid/action/:action')(req), 'should not match pattern with empty request uri');

    req = httpMocks.createRequest({ method: 'GET', params: {}, url: '/user/1'});
    tap.false(pathFilter('/user/:userid/action/:action')(req), 'should not match pattern with more segments in pattern than in request uri');

    req = httpMocks.createRequest({ method: 'GET', params: {}, url: '/user/1/action/create'});
    tap.true(pathFilter('/user/:userid/action/:action')(req), 'should match pattern with equal segments count and keys');
    tap.same(req.params, {userid: '1', action: 'create'}, 'should have correct req.params sideeffect');

    req = httpMocks.createRequest({ method: 'GET', params: {}, url: '/user/1/library/books'});
    tap.false(pathFilter('/user/:userid/action/:action')(req), 'should not match pattern with equal segments count but wrong keys');
    tap.same(req.params, {}, 'should have correct req.params sideeffect');

    tap.end();
  });

  tap.end();
});
