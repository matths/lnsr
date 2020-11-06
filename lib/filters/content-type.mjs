const contentType = type => {
  if (!type) return false;
  let types = Array.isArray(type) ? type : [type];
  types = types.map(type => type.toLowerCase());

  return req => {
    if (!req.headers || !req.headers['content-type']) return false;
    return types.includes(req.headers['content-type'].toLowerCase());
  };
};

export default contentType;
