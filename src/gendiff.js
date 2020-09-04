import program from "commander";

const start = () => {
  program
    .version("0.0.1")
    .description("Compares two configuration files and shows a difference.")
    .arguments("<filepath1> <filepath2>")
    .option("-f, --format [type]", "output format")
    .action((filepath1, filepath2) => {
      console.log("filepath1", filepath1);
      console.log("filepath2", filepath2);
    })
    .parse(process.argv);
};

export default start;
