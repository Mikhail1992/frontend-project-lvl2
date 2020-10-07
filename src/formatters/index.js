import stylishFormatter from './stylish.js';
import plainFormatter from './plain.js';

const formatters = {
  stylish: stylishFormatter,
  plain: plainFormatter,
  json: JSON.stringify,
};

const getFormattedData = (ast, type) => formatters[type](ast);

export default getFormattedData;
