const partial = (fn, ...args) => fn.bind(null, ...args);

export default partial;
