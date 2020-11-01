const uncurry = f => (x, y) => f(x)(y);

export default uncurry;
