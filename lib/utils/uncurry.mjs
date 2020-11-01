const uncurry = f => (x, y) => f(x)(y);

module.exports = uncurry;
