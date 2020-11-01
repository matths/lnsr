const compose = require('compose');

const pipe = (...fns) => compose(...fns.reverse());

module.exports = compose;
