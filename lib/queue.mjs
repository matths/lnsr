const error = (err, req, res, next) => {
  console.error('[unhandled queue error]', err);
  res.statusCode = 500;
  res.write('Internal server error.');
  res.end();
};

const empty = (req, res) => {
  res.statusCode = 200;
  res.end();
};

const execute = (queue, req, res, next, err) => {
  if (err) {
    const errorHandler = !req.error ? error : req.error;
    errorHandler(err, req, res, next);
  } else {
    if (queue.length > 0) {
      const [firstMiddleware, ...remainingQueue] = queue;
      const nextNext = (err) => execute(remainingQueue, req, res, next, err);
      try {
        firstMiddleware(req, res, nextNext);
      } catch (e) {
        nextNext(e);
      }
    } else {
      if (next && typeof next === 'function') {
        return next();
      } else {
        empty(req, res);
      }
    }
  }
};

const queueMiddleware = (...args) => {
    const queue = args.length > 0 && Array.isArray(args[0]) ? args[0] : args;
    return (req, res, next) => execute(queue, req, res, next);
};

export default queueMiddleware;
