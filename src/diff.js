import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import getParsedData from './parsers.js';
import formatter from './formatters/index.js';

const generateAst = (data1, data2) => {
  const keys = [...new Set([...Object.keys(data1), ...Object.keys(data2)])];
  const sortedKeys = _.sortBy(keys);

  const result = sortedKeys.map((key) => {
    const initialValue = data1[key];
    const updatedValue = data2[key];

    if (!_.has(data1, key) && _.has(data2, key)) {
      return {
        key,
        type: 'added',
        value: updatedValue,
      };
    }

    if (_.has(data1, key) && !_.has(data2, key)) {
      return {
        key,
        type: 'removed',
        value: initialValue,
      };
    }

    if (_._.isPlainObject(initialValue) && _._.isPlainObject(updatedValue)) {
      return {
        key,
        type: 'nested',
        children: generateAst(initialValue, updatedValue),
      };
    }

    if (
      _.has(data1, key)
      && _.has(data2, key)
      && !_.isEqual(initialValue, updatedValue)
    ) {
      return {
        key,
        type: 'updated',
        value1: initialValue,
        value2: updatedValue,
      };
    }

    return {
      key,
      type: 'equal',
      value: updatedValue,
    };
  });

  return result;
};

export default (filepath1, filepath2, format = 'stylish') => {
  const filesFormat = path.extname(filepath1).slice(1);

  const file1 = fs.readFileSync(path.resolve(filepath1));
  const file2 = fs.readFileSync(path.resolve(filepath2));

  const data1 = getParsedData(file1, filesFormat);
  const data2 = getParsedData(file2, filesFormat);

  const ast = generateAst(data1, data2);

  return formatter(ast, format);
};
