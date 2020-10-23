const contentTypeFilter = contentType => {
  if (!contentType) return false;
  let contentTypes = Array.isArray(contentType) ? contentType : [contentType];
  contentTypes = contentTypes.map(contentType => contentType.toLowerCase());

  return req => {
    if (!req.headers || !req.headers['content-type']) return false;
    return contentTypes.includes(req.headers['content-type'].toLowerCase());
  };
};

module.exports = contentTypeFilter;
