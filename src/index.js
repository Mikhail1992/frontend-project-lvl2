import fs from 'fs';
import path from 'path';
import getParsedData from './parsers.js';
import getFormattedData from './formatters/index.js';
import generateAst from './ast.js';

export default (filepath1, filepath2, format = 'stylish') => {
  const filesFormat = path.extname(filepath1).slice(1);

  const file1 = fs.readFileSync(path.resolve(filepath1));
  const file2 = fs.readFileSync(path.resolve(filepath2));

  const data1 = getParsedData(file1, filesFormat);
  const data2 = getParsedData(file2, filesFormat);

  const ast = generateAst(data1, data2);

  return getFormattedData(ast, format);
};
