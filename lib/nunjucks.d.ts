import nunjucks from "nunjucks";
import { PathConfig } from "./paths.js";

export type Filter = (
    target: any,
    args: any[],
    kwargs: Record<string, any>,
) => any | Promise<any>;

/**
 *
 * Wrapper for [nunjucks](https://mozilla.github.io/nunjucks).
 *
 * Adds a few filters and functions (see `/plugins`)
 *
 * @see {@link nunjucks.Environment `nunjucks.Environment`}
 */
export class Nunjucks extends nunjucks.Environment {

	/**
	 *
	 * @param dirs The location(s) of the nunjucks files
	 * and partials. Passed directly to
	 * {@link nunjucks.FileSystemLoader `nunjucks.FileSystemLoader`}
	 */
	constructor(dirs: string | string[]);

	/**
	 *
	 * Load global data from a JSON or YAML file.
	 *
	 * @param filepath Path to the file
	 * @param key Key to nest the data under. Defaults to
	 * the filename without the extension. Kebab-case
	 * filenames are converted to camelCase.
	 *
	 * @todo Namespace data keys, according to the
	 * parent folders of the file. (Eg. `data/foo/bar.json`
	 * would be `foo.bar`). This seems intuitive.
	 * @todo namespace the data keys when there are periods
	 * in {@link key `key`}.
	 * @todo Load JS files (ESM, CJS, undefined)
	 */
	loadGlobalFile(filepath: string, key?: string): Promise<void>;
}

declare interface Options {
	paths: PathConfig,
	dataFiles?: string[]
}

/**
 *
 * Create a new {@link Nunjucks `Nunjucks`} instance, and
 * load the given data-file paths.
 *
 * @note May be removed, in favor of instantiating the
 * class manually.
 */
export function createEnv(config: Options): Promise<Nunjucks>;
