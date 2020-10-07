import _ from 'lodash';

const generateAst = (data1, data2) => {
  const keys = _.union(Object.keys(data1), Object.keys(data2));
  const sortedKeys = _.sortBy(keys);

  const result = sortedKeys.map((key) => {
    const initialValue = data1[key];
    const updatedValue = data2[key];

    if (!_.has(data1, key)) {
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

    if (_.isPlainObject(initialValue) && _.isPlainObject(updatedValue)) {
      return {
        key,
        type: 'nested',
        children: generateAst(initialValue, updatedValue),
      };
    }

    if (!_.isEqual(initialValue, updatedValue)) {
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

export default generateAst;
