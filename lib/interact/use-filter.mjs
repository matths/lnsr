const useFilter = (filters, middleware) => (req, res, next) => {
  filters = Array.isArray(filters) ? filters : (filters ? [filters] : []);
  filters.length>0 && filters.reduce((matching, filter) => matching && typeof filter === 'function' && filter(req), true)
    ? middleware(req, res, next) : next();
};

export default useFilter;
