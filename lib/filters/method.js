const allowedMethods = [
  'options',
  'get',
  'head',
  'post',
  'put',
  'delete',
  'trace',
  'connect'
];

const methodFilter = (...methods) => {
  methods = methods.length > 0 && Array.isArray(methods[0]) ? methods[0] : methods;
  methods = methods
    .map(method => method.toLowerCase())
    .filter(method => allowedMethods.includes(method));
  if (methods.length < 1) return false;
  return req => (req.method && methods.includes(req.method.toLowerCase()));
}

module.exports = methodFilter;
