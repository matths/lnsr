import url from 'url';

const splitAtSlashes = path => typeof path === 'string' && path.match(/\/[^/]+/gi) || false;
const isPlaceholderSegment = segment => segment.match(/^\/:.*$/gi);
const removeLeadingSlash = segment => segment.replace(/^\//,'');
const removeLeadingSlashAndColon = segment => segment.replace(/^\/:/,'');

const identifyParams = (patternSegments, pathSegments) => {
  return patternSegments.reduce( (params, patternSegment, index) => {
    if (isPlaceholderSegment(patternSegment)) {
      const key = removeLeadingSlashAndColon(patternSegment);
      const value = removeLeadingSlash(pathSegments[index]);
      params[key] = value;
    }
    return params;
  }, {});
};

const matchesTheQuery = (patternSegments, pathSegments) => {
  return patternSegments.reduce( (doesMatch, patternSegment, index) =>
    !isPlaceholderSegment(patternSegment) ?
      (patternSegment === pathSegments[index]) && doesMatch :
      doesMatch
  , true);
};

const pathFilter = pattern => {
  const patternSegments = splitAtSlashes(pattern);
  if (patternSegments===false) return false;

  return req => {
    const pathSegments = splitAtSlashes(url.parse(req.url, true).pathname);
    if (pathSegments===false) return false;
    if (patternSegments.length > pathSegments.length) return false;
    if (!matchesTheQuery(patternSegments, pathSegments)) return false;
    const params = identifyParams(patternSegments, pathSegments);
    req.params = {...req.params, ...params};
    return true;
  };
};

export default pathFilter;
