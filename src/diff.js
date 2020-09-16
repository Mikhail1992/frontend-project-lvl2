import fs from "fs";
import path from "path";
import _ from "lodash";

const getFormattedLine = (node) => {
  const operationDiffLines = {
    equal: `  ${node.key}: ${node.value}`,
    removed: `- ${node.key}: ${node.value}`,
    added: `+ ${node.key}: ${node.value}`,
    updated: `- ${node.key}: ${node.value1}\n+ ${node.key}: ${node.value2}`,
  };

  return operationDiffLines[node.status];
};

const getAst = (initialData, editedData) => {
  const keys = [
    ...new Set([...Object.keys(initialData), ...Object.keys(editedData)]),
  ];

  const result = keys.map((key) => {
    if (
      _.has(editedData, key) &&
      _.isEqual(initialData[key], editedData[key])
    ) {
      return {
        key,
        value: editedData[key],
        status: "equal",
      };
    }

    if (
      _.has(initialData, key) &&
      _.has(editedData, key) &&
      !_.isEqual(initialData[key], editedData[key])
    ) {
      return {
        key,
        value1: initialData[key],
        value2: editedData[key],
        status: "updated",
      };
    }

    if (_.has(initialData, key) && !_.has(editedData, key)) {
      return {
        key,
        value: initialData[key],
        status: "removed",
      };
    }

    if (!_.has(initialData, key) && _.has(editedData, key)) {
      return {
        key,
        value: editedData[key],
        status: "added",
      };
    }
  });

  return result;
};

const getStyledDiff = (initialData, editedData) => {
  const ast = getAst(initialData, editedData);

  return `{\n${ast.map(getFormattedLine).join("\n")}\n}`;
};

export default async (filepath1, filepath2) => {
  const file1 = fs.readFileSync(path.resolve(filepath1));
  const file2 = fs.readFileSync(path.resolve(filepath2));

  const data1 = JSON.parse(file1);
  const data2 = JSON.parse(file2);

  return getStyledDiff(data1, data2);
};
