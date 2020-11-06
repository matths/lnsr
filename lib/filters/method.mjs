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

const method = (methods) => {
  if (!methods) return false;
  methods = Array.isArray(methods) ? methods : [methods];
  methods = methods
    .map(method => method.toLowerCase())
    .filter(method => allowedMethods.includes(method));
  if (methods.length==0) return false;
  return req => (req.method && methods.includes(req.method.toLowerCase()));
};

export default method;
