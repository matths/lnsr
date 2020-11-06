import url from 'url';

const simplePath = str => req =>
  url.parse(req.url, true).pathname.indexOf(str) != -1;

export default simplePath;
