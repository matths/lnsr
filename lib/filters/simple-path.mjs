const url = require('url');

const simplePathFilter = str => req =>
  url.parse(req.url, true).pathname.indexOf(str) != -1;

module.exports = simplePathFilter;
