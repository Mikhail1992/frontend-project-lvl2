import _ from 'lodash';

const indent = (level) => '  '.repeat(level);

const stringify = (data, depth, mapping) => {
  if (!_.isObject(data)) {
    return data;
  }

  const result = Object.entries(data).map(([key, value]) => (
    mapping.equal({ key, value }, depth + 2)));

  return `{\n${result.join('\n')}\n${indent(depth + 2)}}`;
};

const mapping = {
  nested: (node, depth, iter) => `${indent(depth)}    ${node.key}: ${iter(node.children, depth + 2)}`,
  added: (node, depth) => `${indent(depth)}  + ${node.key}: ${stringify(node.value, depth, mapping)}`,
  removed: (node, depth) => `${indent(depth)}  - ${node.key}: ${stringify(node.value, depth, mapping)}`,
  equal: (node, depth) => `${indent(depth)}    ${node.key}: ${stringify(node.value, depth, mapping)}`,
  updated: (node, depth) => {
    const { key, value1, value2 } = node;

    const data1 = `${indent(depth)}  - ${key}: ${stringify(
      value1,
      depth,
      mapping,
    )}`;
    const data2 = `${indent(depth)}  + ${key}: ${stringify(
      value2,
      depth,
      mapping,
    )}`;

    return [data1, data2];
  },
};

const renderStylish = (ast) => {
  const iter = (subtree, depth) => {
    const result = subtree.flatMap((node) => mapping[node.type](node, depth, iter));

    return `{\n${result.join('\n')}\n${indent(depth)}}`;
  };

  return iter(ast, 0);
};

export default renderStylish;
