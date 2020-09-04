import program from "commander";

const start = () => {
  program
    .version("0.0.1")
    .description("Compares two configuration files and shows a difference.")
    .parse(process.argv);
};

export default start;
