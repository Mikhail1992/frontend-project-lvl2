import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import gendiff from '../src/diff';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

const formats = ['yml', 'json'];

describe('gendiff', () => {
  test.each(formats)('gendiff %s', (format) => {
    // arrange
    const filepath1 = getFixturePath(`${format}/file1.${format}`);
    const filepath2 = getFixturePath(`${format}/file2.${format}`);

    // act
    const actual = readFile(`${format}/result.txt`);

    // assert
    expect(gendiff(filepath1, filepath2)).toEqual(actual);
  });
});
