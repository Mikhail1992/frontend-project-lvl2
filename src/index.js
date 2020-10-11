import fs from 'fs';
import path from 'path';
import getParsedData from './parsers.js';
import getFormattedData from './formatters/index.js';
import generateAst from './ast.js';

export default (filepath1, filepath2, format = 'stylish') => {
  const filesFormat = path.extname(filepath1).slice(1);

  const content1 = fs.readFileSync(path.resolve(filepath1));
  const content2 = fs.readFileSync(path.resolve(filepath2));

  const data1 = getParsedData(content1.toString(), filesFormat);
  const data2 = getParsedData(content2.toString(), filesFormat);

  const ast = generateAst(data1, data2);

  return getFormattedData(ast, format);
};
