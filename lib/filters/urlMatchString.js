import url from 'url';

const urlMatchStringFilter = str => req =>
  url.parse(req.url, true).pathname.indexOf(str) != -1;

module.exports = urlMatchStringFilter;
