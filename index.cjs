#!/usr/bin/env node

// ":" //#;exec /usr/bin/env node --input-type=module - "$@" < "$0"

const {program} = require("commander");

program
    .name("njk")
    .version("0.1.0", '-v, --version')
    .description("A cli for nunjucks");

program
    .argument("<input>", "Source templates to transform. May be a file or directory.")
    .argument("<output>", "Output file or directory")
    .option("-d, --data <path>", "Path to a json or yaml file", (val, prev) => {
        return prev.concat([val]);
    }, []);

program.parse(process.argv);

import("./app.js").then(app => {
    app.run(program.processedArgs[0], program.processedArgs[1], program.opts());
}).catch(err => {
    throw new Error(err);
})