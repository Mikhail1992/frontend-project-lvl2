import _ from 'lodash';

const parser = (value) => {
  if (_.isBoolean(value)) {
    return value;
  }

  if (!_.isObject(value)) {
    return `'${value}'`;
  }

  return '[complex value]';
};

const getFullPath = (path) => path.join('.');

const mapping = {
  nested: (node, path, parseNested) => `${parseNested(node.children, [...path, node.key])}`,
  equal: () => null,
  removed: (node, path) => `Property '${getFullPath([...path, node.key])}' was removed`,
  added: (node, path) => `Property '${getFullPath([
    ...path,
    node.key,
  ])}' was added with value: ${parser(node.value)}`,
  updated: (node, path) => `Property '${getFullPath([...path, node.key])}' was updated. From ${parser(
    node.value1,
  )} to ${parser(node.value2)}`,
};

const renderPlain = (ast, path = []) => `${ast
  .map((line) => mapping[line.type](line, path, renderPlain))
  .filter((x) => x)
  .join('\n')}`;

export default renderPlain;
