import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import gendiff from '../src/diff';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

test('gendiff', () => {
  // arrange
  const filepath1 = getFixturePath('json/1.json');
  const filepath2 = getFixturePath('json/2.json');

  // act
  const actual = readFile('json/result.txt');

  // assert
  expect(gendiff(filepath1, filepath2)).toEqual(actual);
});
