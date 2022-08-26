#!/usr/bin/env node

// ":" //#;exec /usr/bin/env node --input-type=module - "$@" < "$0"

const { program } = require('commander');

program
	.name('njk')
	.version('0.1.1', '-v, --version')
	.description('A small cli for nunjucks');

program
	.argument(
		'<input>',
		'Source templates to transform. May be a file or directory.',
	)
	.argument('<output>', 'Output file or directory')
	.option(
		'-d, --data <path>',
		'Path to a json or yaml file',
		(value, previous) => [...previous, value], [],
	);

program.parse();

import('./app.js').then(app => {
	app.run(program.processedArgs[0], program.processedArgs[1], program.opts());
}).catch(error => {
	throw new Error(error);
});
