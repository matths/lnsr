import url from 'url';

const parameter = (param, value) => req =>
  url.parse(req.url, true).query[param] == value;

export default parameter;
