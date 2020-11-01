import compose from 'compose';

const pipe = (...fns) => compose(...fns.reverse());

export default compose;
