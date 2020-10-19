var tap = require('tap');
var sinon = require('sinon');
var rewire = require('rewire');
var httpMocks = require('node-mocks-http');
const pathFilter = require('../../../../lib/filters/path');

var filterPath = rewire('../../../../lib/filters/path');

function spyOnPrivateMethod (methodStr, obj) {
    var method = obj.__get__(methodStr);
    var methodSpy = sinon.spy(method);
    obj.__set__(methodStr, methodSpy);
    return methodSpy;
}

tap.test('path filter module', function (tap) {
  
  tap.test('when using internal splitAtSlashes', function (tap) {
    tap.plan(4);
    var split = filterPath.__get__('splitAtSlashes');
    tap.same(split('/aaa/bbb'), ['/aaa', '/bbb'], 'should split string in portions starting with a slash');
    tap.same(split('/aaa/bbb/'), ['/aaa', '/bbb'], 'should ignore trailing slash');
    tap.false(split('somethingwrong'), 'should return false when string is no path');
    tap.false(split(), 'should return false when there is no string');
    tap.end();
  });

  tap.test('when using internal isPlaceholderSegment', function (tap) {
    tap.plan(2);
    var isPlaceholderSegment = filterPath.__get__('isPlaceholderSegment');
    tap.true(isPlaceholderSegment('/:userid'), 'should detect placeholders');
    tap.false(isPlaceholderSegment('somethingwrong'), 'should return false if no placeholder');
    tap.end();
  });

  tap.test('when using internal removeLeadingSlash', function (tap) {
    tap.plan(2);
    var removeLeadingSlash = filterPath.__get__('removeLeadingSlash');
    tap.strictEqual(removeLeadingSlash('/user'), 'user', 'should remove leading slash');
    tap.strictEqual(removeLeadingSlash('somethingwrong'), 'somethingwrong', 'should return original string otherweise');
    tap.end();
  });

  tap.test('when using internal removeLeadingSlashAndColon', function (tap) {
    tap.plan(2);
    var removeLeadingSlashAndColon = filterPath.__get__('removeLeadingSlashAndColon');
    tap.strictEqual(removeLeadingSlashAndColon('/:user'), 'user', 'should remove leading slash and colon');
    tap.strictEqual(removeLeadingSlashAndColon('somethingwrong'), 'somethingwrong', 'should return original string otherweise');
    tap.end();
  });

  tap.test('when using internal matchesTheQuery', function (tap) {
    tap.plan(3);
    var matchesTheQuery = filterPath.__get__('matchesTheQuery');
    tap.true(
      matchesTheQuery(
        ['/user', '/:useid', '/action', '/:action'],
        ['/user', '1', '/action', 'create']
      ),
      'should return true when all non placeholder segments match'
    );
    tap.false(
      matchesTheQuery(
        ['/user', '/:useid', '/profile'],
        ['/user', '1', '/action']
      ),
      'should return false when one non placeholder segments doesnt match'
    );
    tap.false(
      matchesTheQuery(
        ['/user', '/:useid', '/profile'],
        ['/user', '1']
      ),
      'should return false when segments count differ'
    );
    tap.end();
  });

  tap.test('when using internal identifyParams', function (tap) {
    tap.plan(1);
    var identifyParams = filterPath.__get__('identifyParams');
    tap.same(
      identifyParams(
        ['/user', '/:userid', '/action', '/:action'],
        ['/user', '1', '/action', 'create']
      ),
      { 'userid': '1', 'action': 'create'},
      'should return matching placeholder segments as params object'
    );
    tap.end();
  });

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
