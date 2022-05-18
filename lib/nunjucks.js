import fs from 'node:fs/promises';
import path from "node:path";
import { types } from 'node:util';

import camelcase from 'camelcase';
import yaml from 'js-yaml';
import nunjucks from "nunjucks";

import * as plugins from '../plugins/index.js';

/**
 * 
 * @param {object} config
 * @param {import("./paths").PathConfig} config.paths 
 * @param {string[]} [config.dataFiles] 
 * 
 * @returns {Promise<nunjucks.Environment>}
 */
export async function createEnv({ paths, dataFiles=[] }) {
    const loader = new nunjucks.FileSystemLoader([
        paths.src ? path.resolve(paths.src) : paths.cwd,
    ]);
    
    const env = new nunjucks.Environment([ loader ]);

    // Global Data
    for(const file of dataFiles) {
        const str = await fs.readFile(file, 'utf-8');
        let data = {};

        if(file.endsWith(".json")) {
            data = JSON.parse(str);
        } else if (file.endsWith(".yaml") || file.endsWith(".yml")) {
            data = yaml.load(str, { filename: file });
        }

        const key = path.basename(file, path.extname(file));
        
        env.addGlobal(camelcase(key, {
            locale: "en-US",
            preserveConsecutiveUppercase: true,
        }), data);
    }

    // Functions
    for(const [funcName, funcBody] of Object.entries(plugins.functions)) {
        env.addGlobal(funcName, funcBody);
    }

    // Filters
    for(const [filterName, filter] of Object.entries(plugins.filters)) {
        env.addFilter(filterName, filter, types.isAsyncFunction(filter));
    }

    return env;
}