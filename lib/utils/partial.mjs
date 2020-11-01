const partial = (fn, ...args) => fn.bind(null, ...args);

module.exports = partial;
