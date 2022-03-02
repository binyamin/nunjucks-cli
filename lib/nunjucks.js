import fs from 'node:fs/promises';
import path from "node:path";

import nunjucks from "nunjucks";
import yaml from 'js-yaml';

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

    for(const file of dataFiles) {
        const str = await fs.readFile(file, 'utf-8');
        let data = {};

        if(file.endsWith(".json")) {
            data = JSON.parse(str);
        } else if (file.endsWith(".yaml") || file.endsWith(".yml")) {
            data = yaml.load(str, { filename: file });
        }
        
        env.addGlobal(path.basename(file, path.extname(file)), data);
    }
    
    return env;
}