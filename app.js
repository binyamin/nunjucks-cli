import path from 'node:path';

import { createEnv } from './lib/nunjucks.js';
import { getPaths } from './lib/paths.js';
import { writeFile } from './lib/utils.js';

export { Nunjucks } from './lib/nunjucks.js';

/**
 *
 * @type {import('./app')['run']}
 */
export async function run(input, output, options = {}) {
	const pathConfig = await getPaths(input, output);
	const env = await createEnv({
		paths: pathConfig,
		dataFiles: options.data || [],
	});

	const results = [];

	for (const templatePath of pathConfig.files) {
		// [1] File contents
		const contents = env.render(templatePath);

		// [2] Output path
		// If `pathConfig.outputFile` is defined, use it; else, use
		// `templatePath`
		let outputPath = pathConfig?.outputFile
			|| templatePath.replace(/\.njk$/, '.html');

		// Convert `outputPath` to an absolute path, pointing to the output
		// directory
		outputPath = path.resolve(pathConfig.dest, outputPath);

		// [3] Write the file
		results.push(writeFile(outputPath, contents, 'utf8'));
	}

	await Promise.all(results);
}
