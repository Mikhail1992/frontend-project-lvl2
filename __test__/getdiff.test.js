import fs from 'fs';
import path from 'path';

import gendiff from '../src/diff';

const __dirname = path.resolve();

const getFixturePath = (filename) => path.join(__dirname, '__fixtures__', filename);
const readFixture = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8').trim();

test('gendiff', () => {
  // arrange
  const filepath1 = getFixturePath('json/1.json');
  const filepath2 = getFixturePath('json/2.json');

  // act
  const actual = readFixture('json/result.txt');

  // assert
  expect(gendiff(filepath1, filepath2)).toEqual(actual);
});
