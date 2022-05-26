import fs from 'node:fs/promises';
import path from "node:path";
import { types } from 'node:util';

import camelcase from 'camelcase';
import yaml from 'js-yaml';
import { FileSystemLoader, Environment } from "nunjucks";

import * as plugins from '../plugins/index.js';

export class Nunjucks extends Environment {
    /**
     *
     * @param {string|string[]} dirs Passed to `nunjucks.FileSystemLoader`
     */
    constructor(dirs) {
        const fs = new FileSystemLoader(dirs);
        super(fs);

        // Functions
        for(const [funcName, funcBody] of Object.entries(plugins.functions)) {
            this.addGlobal(funcName, funcBody);
        }

        // Filters
        for(const [filterName, filter] of Object.entries(plugins.filters)) {
            this.addFilter(filterName, (target, ...args) => {
                const kwargs = args.at(-1)?.__keywords === true ? args.pop() : {};
                if (kwargs.__keywords) delete kwargs.__keywords;

                return filter(target, args, {...kwargs});
            }, types.isAsyncFunction(filter));
        }
    }

    /**
     *
     * @access private
     *
     * Load a JSON or YAML file, and return the result.
     *
     * @param {string} filepath
     * @returns {Promise<unknown>}
     */
    async #getDataFile(filepath) {
        const ext = path.extname(filepath).slice(1);

        const str = await fs.readFile(path.resolve(filepath), 'utf8');

        if(ext === 'json') {
            return JSON.parse(str);
        }

        if (['yaml', 'yml'].includes(ext)) {
            return yaml.load(str, { filename: filepath });
        }

        throw new Error(`File extension '${ext}' is not supported`)
    }

    /**
     *
     * Load global data from a JSON or YAML file.
     *
     * @param {string} filepath path to the file
     * @param {string} [key] Key to nest data under. Defaults
     * to the filename without the extension. Dash-separated
     * filenames are converted to camelCase.
     * @returns {Promise<void>}
     */
    async loadGlobalFile(filepath, key) {
        const data = await this.#getDataFile(filepath);

        key ??= path.basename(filepath, path.extname(filepath));

        this.addGlobal(camelcase(key, {
            locale: "en-US",
            preserveConsecutiveUppercase: true,
        }), data);
    }
}

/**
 *
 * @param {object} config
 * @param {import("./paths").PathConfig} config.paths
 * @param {string[]} [config.dataFiles]
 *
 * @returns {Promise<Nunjucks>}
 */
export async function createEnv({ paths, dataFiles=[] }) {
    const env = new Nunjucks([
        paths.src ? path.resolve(paths.src) : paths.cwd,
    ]);

    // Global Data
    const results = [];
    for(const file of dataFiles) {
        results.push(env.loadGlobalFile(file));
    }
    await Promise.all(results);

    return env;
}
