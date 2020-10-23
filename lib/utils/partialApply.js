const partialApply = (fn, args) => fn.bind(null, ...args);

module.exports = partialApply;
