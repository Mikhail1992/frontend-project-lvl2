import yaml from 'js-yaml';

const parsers = {
  yml: yaml.safeLoad,
  yaml: yaml.safeLoad,
  json: JSON.parse,
};

const getParsedData = (data, format) => parsers[format](data);

export default getParsedData;
