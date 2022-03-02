import path from 'node:path';

import { walk } from './utils.js';

/**
 * Make path relative if needed
 * @param {string} p path-like
 * @returns {string}
 */

function validatePath(p) {
    if(path.isAbsolute(p)) {
        return path.relative(process.cwd(), p);
    } else {
        return p;
    }
}

/**
 * Does this pathString point to a file?
 * @param {string} pathString path to a maybe file or maybe directory
 * @returns {boolean}
 */
function isFile(pathString) {
    return path.parse(pathString).ext.length > 0;
}

/**
 * @typedef {object} PathConfig
 * @prop {string} cwd Absolute path to working directory
 * @prop {string|undefined} src relative path to dir containing {@link PathConfig.files}
 * @prop {string} dest relative path to dir for output files. Replaces {@link PathConfig.src}
 * @prop {string[]} files list of paths to input files; relative to {@link PathConfig.src}
 * @prop {string} [outputFile] path for output file; relative to {@link PathConfig.dest}.
 * Only exists the user passes a file for the output argument
 */

/**
 * @param {string} rawSource user-provided string for input
 * @param {string} rawOutput user-provided string for output
 * 
 * @returns {Promise<PathConfig>}
 */

export async function getPaths(rawSource, rawOutput) {
    /**
     * This is the return object
     * 
     * @type {Partial<PathConfig>}
     */
    const PathConfig = {
        cwd: process.cwd()
    };

    
    // [1] Process raw user-input
    const inputArgument = validatePath(rawSource);
    const outputArgument = validatePath(rawOutput);


    // [2] `PathConfig.src`
    // We need to know whether `inputArgument` is a file or a directory. If it's a file,
    // then `PathConfig.src` should equal `undefined`
    if (isFile(inputArgument)) PathConfig.src = undefined;
    else PathConfig.src = inputArgument;


    // [3] `PathConfig.dest` and `PathConfig.outputFile`
    if(isFile(outputArgument)) {
        // If `outputArgument` points to a file (ie. has a file extension), set
        // `PathConfig.outputFile` to the filename and `PathConfig.dest` to the directory
        // path. 
        PathConfig.dest = path.dirname(outputArgument);
        PathConfig.outputFile = path.basename(outputArgument);
    } else {
        // Otherwise, set `PathConfig.dest` to the entire path
        PathConfig.dest = outputArgument;
    }
    

    // [4] Set `PathConfig.files`
    if(PathConfig.src) {
        // Since `PathConfig.src` exists, it must be a directory
        let tempFiles = await walk(PathConfig.src);
        tempFiles = tempFiles.map(file => path.relative(path.resolve(PathConfig.src), file));
        tempFiles = tempFiles.filter(file => /\.(njk|html)$/.test(file));
        PathConfig.files = tempFiles;
    } else {
        PathConfig.files = [ inputArgument ];
    }

    
    return PathConfig;
}