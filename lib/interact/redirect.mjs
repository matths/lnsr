const redirect = (statusCode, location) => (req, res, next) => {
  if (!statusCode) {
    next('no status code');
  } else if (!location) {
    next('no location');
  } else {
    res.writeHead(statusCode, {'Location': location});
    res.end();
  }
};

export default redirect;
