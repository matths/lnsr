const url = require('url');

const parameterFilter = (param, value) => req =>
  url.parse(req.url, true).query[param] == value;

module.exports = parameterFilter;
