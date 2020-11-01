import url from 'url';

const parameterFilter = (param, value) => req =>
  url.parse(req.url, true).query[param] == value;

export default parameterFilter;
