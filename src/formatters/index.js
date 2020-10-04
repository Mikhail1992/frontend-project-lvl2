import stylishFormatter from './stylish.js';

const formatters = {
  stylish: stylishFormatter,
};

const formatter = (ast) => formatters.stylish(ast);

export default formatter;
