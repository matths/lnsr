const { false } = require("tap");

const blockFilter = () => (req) => false;

module.exports = blockFilter;
