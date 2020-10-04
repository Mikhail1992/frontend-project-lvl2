import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import gendiff from '../src/diff';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const formats = ['yml', 'json', 'ini'];

describe('gendiff', () => {
  const stylishResult = readFile('result-stylish.txt');
  const plainResult = readFile('result-plain.txt');
  const jsonResult = readFile('result-json.json');

  test.each(formats)('gendiff %s', (format) => {
    // arrange
    const filepath1 = getFixturePath(`file1.${format}`);
    const filepath2 = getFixturePath(`file2.${format}`);

    // assert
    expect(gendiff(filepath1, filepath2)).toEqual(stylishResult);
    expect(gendiff(filepath1, filepath2, 'plain')).toEqual(plainResult);
    expect(gendiff(filepath1, filepath2, 'json')).toEqual(jsonResult);
  });
});
