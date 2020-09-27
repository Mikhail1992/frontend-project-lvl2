import program from 'commander';
import diff from './diff.js';

const start = () => {
  program
    .version('0.0.1')
    .description('Compares two configuration files and shows a difference.')
    .arguments('<filepath1> <filepath2>')
    .option('-f, --format [type]', 'output format')
    .action((filepath1, filepath2) => {
      console.log(diff(filepath1, filepath2, program.format));
    })
    .parse(process.argv);
};

export default start;
