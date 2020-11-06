import identity from './identity.mjs';
import uncurry from './uncurry.mjs';

const uncurryn = n => f => (...xs) => {
  const next = acc => xs => xs.reduce(uncurry(identity), acc);
  if (n > xs.length) throw new RangeError('too few arguments');
  return next(f) (xs.slice(0, n));
};

export default uncurryn;
