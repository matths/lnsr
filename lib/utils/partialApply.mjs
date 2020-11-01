const partialApply = (fn, args) => fn.bind(null, ...args);

export default partialApply;
