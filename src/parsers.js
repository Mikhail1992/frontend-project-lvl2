import yaml from "js-yaml";

const parsers = {
  yml: yaml.safeLoad,
  yaml: yaml.safeLoad,
  json: JSON.parse,
};

export const getParsedData = (data, format) => {
  const parser = parsers[format];
  return parser(data);
};
