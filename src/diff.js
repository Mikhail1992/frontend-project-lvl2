import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import getParsedData from './parsers.js';

const getFormattedLine = (node, level = 1) => {
  const indentSpaces = 2;
  const indent = Array(level * indentSpaces)
    .fill()
    .map(() => ' ')
    .join('');

  const operationDiffLines = {
    equal: `${indent}  ${node.key}: ${node.value}`,
    removed: `${indent}- ${node.key}: ${node.value}`,
    added: `${indent}+ ${node.key}: ${node.value}`,
    updated: `${indent}- ${node.key}: ${node.value1}\n+ ${node.key}: ${node.value2}`,
  };

  return operationDiffLines[node.status];
};

const getAst = (initialData, editedData) => {
  const keys = [
    ...new Set([...Object.keys(initialData), ...Object.keys(editedData)]),
  ];

  const result = keys
    .map((key) => {
      if (
        _.has(editedData, key)
        && _.isEqual(initialData[key], editedData[key])
      ) {
        return {
          key,
          value: editedData[key],
          status: 'equal',
        };
      }

      if (
        _.has(initialData, key)
        && _.has(editedData, key)
        && !_.isEqual(initialData[key], editedData[key])
      ) {
        return {
          key,
          value1: initialData[key],
          value2: editedData[key],
          status: 'updated',
        };
      }

      if (_.has(initialData, key) && !_.has(editedData, key)) {
        return {
          key,
          value: initialData[key],
          status: 'removed',
        };
      }

      if (!_.has(initialData, key) && _.has(editedData, key)) {
        return {
          key,
          value: editedData[key],
          status: 'added',
        };
      }

      return null;
    })
    .filter((v) => v);

  return result;
};

const getStyledDiff = (initialData, editedData) => {
  const ast = getAst(initialData, editedData);

  return `{\n${ast.map((line) => getFormattedLine(line)).join('\n')}\n}`;
};

export default (filepath1, filepath2, format) => {
  const filesFormat = format || path.extname(filepath1).slice(1);

  const file1 = fs.readFileSync(path.resolve(filepath1));
  const file2 = fs.readFileSync(path.resolve(filepath2));

  const data1 = getParsedData(file1, filesFormat);
  const data2 = getParsedData(file2, filesFormat);

  return getStyledDiff(data1, data2);
};
