import renderStylish from './stylish.js';
import renderPlain from './plain.js';

const formatters = {
  stylish: renderStylish,
  plain: renderPlain,
  json: JSON.stringify,
};

const getFormattedData = (ast, type) => formatters[type](ast);

export default getFormattedData;
