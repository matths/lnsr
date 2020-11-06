const protocol = proto => {
  if (!proto) return false;
  return req => {
    let p = req.connection && req.connection.encrypted ? 'https' : 'http';
    p = req.headers['x-forwarded-p'] || p;
    p = p.split(/\s*,\s*/)[0];
    return proto === p;
  };
};

export default protocol;
