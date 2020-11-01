import compose from 'compose.mjs';

const pipe = (...fns) => compose(...fns.reverse());

export default compose;
