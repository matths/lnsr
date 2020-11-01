const errorMiddleware = customError => (req, res, next) => {
  if (customError) req.error = customError;
  return next();
}

module.exports = errorMiddleware;
