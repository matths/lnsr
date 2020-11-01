const protocolFilter = protocol => {
  if (!protocol) return false;
  return req => {
    let proto = req.connection && req.connection.encrypted ? 'https' : 'http';
    proto = req.headers['x-forwarded-proto'] || proto;
    proto = proto.split(/\s*,\s*/)[0];
    return protocol === proto;
  }
}

module.exports = protocolFilter;
