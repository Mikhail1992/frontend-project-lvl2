import _ from 'lodash';

const depth = (indent) => '  '.repeat(indent);

const parser = (data, indent, mapping) => {
  if (!_.isObject(data)) {
    return data;
  }

  const keys = Object.keys(data);
  const stringLine = keys.map((key) => mapping.equal({ key, value: data[key] }, indent + 2));

  return `{\n${stringLine.join('\n')}\n${depth(indent + 1)}}`;
};

const mapping = {
  nested: (node, indent, parseNested) => `${depth(indent)}  ${node.key}: ${parseNested(node.children, indent + 2)}`,
  equal: (node, indent) => `${depth(indent)}  ${node.key}: ${parser(node.value, indent, mapping)}`,
  removed: (node, indent) => `${depth(indent)}- ${node.key}: ${parser(node.value, indent, mapping)}`,
  added: (node, indent) => `${depth(indent)}+ ${node.key}: ${parser(node.value, indent, mapping)}`,
  updated: (node, indent) => {
    const line1 = `${depth(indent)}- ${node.key}: ${parser(
      node.value1,
      indent,
      mapping,
    )}`;
    const line2 = `${depth(indent)}+ ${node.key}: ${parser(
      node.value2,
      indent,
      mapping,
    )}`;

    return `${line1}\n${line2}`;
  },
};

const stylishFormatter = (ast, level = 1) => `{\n${ast
  .map((line) => mapping[line.type](line, level, stylishFormatter))
  .join('\n')}\n${depth(level - 1)}}`;

export default stylishFormatter;
