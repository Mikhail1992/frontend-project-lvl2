import _ from 'lodash';

const depth = (level) => '  '.repeat(level);

const parser = (data, level, mapping) => {
  if (!_.isObject(data)) {
    return data;
  }

  const dataKeysList = Object.keys(data);
  const stringLine = dataKeysList.map((key) => mapping.equal({ key, value: data[key] }, level + 2));

  return `{\n${stringLine.join('\n')}\n${depth(level + 1)}}`;
};

const mapping = {
  nested: (node, level, parseNested) => `${depth(level)}  ${node.key}: ${parseNested(node.children, level + 2)}`,
  equal: (node, level) => `${depth(level)}  ${node.key}: ${parser(node.value, level, mapping)}`,
  removed: (node, level) => `${depth(level)}- ${node.key}: ${parser(node.value, level, mapping)}`,
  added: (node, level) => `${depth(level)}+ ${node.key}: ${parser(node.value, level, mapping)}`,
  updated: (node, level) => {
    const line1 = `${depth(level)}- ${node.key}: ${parser(
      node.value1,
      level,
      mapping,
    )}`;
    const line2 = `${depth(level)}+ ${node.key}: ${parser(
      node.value2,
      level,
      mapping,
    )}`;

    return `${line1}\n${line2}`;
  },
};

const stylishFormatter = (ast, level = 1) => `{\n${ast
  .map((line) => mapping[line.type](line, level, stylishFormatter))
  .join('\n')}\n${depth(level - 1)}}`;

export default stylishFormatter;
