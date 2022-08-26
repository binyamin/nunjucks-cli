import type { Nunjucks } from './lib/nunjucks.js';

declare interface Options {
	/**
	 *
	 * YAML or JSON files containing global data
	 *
	 * @default []
	 */
	data?: string[];
}

/**
 *
 * Mimics the CLI, for testing purposes. You probably want
 * to use the {@link Nunjucks `Nunjucks`} class.
 *
 * @param input input file or directory
 * @param output output file or directory
 * @param options
 */
export function run(
	input: string,
	output: string,
	options?: Options
): Promise<void>;

export { Nunjucks } from './lib/nunjucks.js';
