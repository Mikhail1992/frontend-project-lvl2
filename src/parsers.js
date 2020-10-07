import yaml from 'js-yaml';
import ini from 'ini';
import _ from 'lodash';

const parseNumber = (obj) => _.mapValues(obj, (value) => {
  if (_.isObject(value)) {
    return parseNumber(value);
  }
  if (parseFloat(value)) {
    return parseFloat(value);
  }

  return value;
});

const iniParser = (content) => {
  const data = ini.parse(content.toString());
  return parseNumber(data);
};

const parsers = {
  yml: yaml.safeLoad,
  yaml: yaml.safeLoad,
  json: JSON.parse,
  ini: iniParser,
};

const getParsedData = (data, format) => parsers[format](data);

export default getParsedData;
