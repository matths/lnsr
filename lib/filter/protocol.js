function protocol (protocol, middleware) {
  if (!protocol) return false;

  return function (req, res, next) {
    var proto = 'http';
    if (req.connection && req.connection.encrypted) {
      proto = 'https';
    }
    proto = req.headers['x-forwarded-proto'] || proto;
    proto = proto.split(/\s*,\s*/)[0];
    console.log('proto', proto);

		if (protocol === proto && typeof middleware === 'function') {
			return middleware(req, res, next);
		}
		return next();
	};
};

module.exports = protocol;
