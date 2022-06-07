import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Get all files within subdirectories
 * @param {string} dir directory to crawl
 * @param {string[]} [_fileList] Array which keeps the list of files in-memory
 * @returns {Promise<string[]>}
 */
export async function walk(dir, _fileList = []) {
	const files = await fs.readdir(dir);
	/* eslint-disable no-await-in-loop */
	for (const file of files) {
		const stat = await fs.stat(path.join(dir, file));
		if (stat.isDirectory()) {
			_fileList = await walk(path.join(dir, file), _fileList);
		} else {
			_fileList.push(path.join(dir, file));
		}
	}
	/* eslint-enable no-await-in-loop */

	return _fileList;
}

/**
 * Write data to a file, making parent directories as needed
 * @param {string} filepath - absolute path to a file
 * @param { string | Uint8Array } data - data to write
 * @param { import("fs").WriteFileOptions } [options] - same as `fs.writeFile()`
 * options
 * @return {Promise<void>}
 */
export async function writeFile(filepath, data, options) {
	const { dir } = path.parse(filepath);
	await fs.mkdir(dir, { recursive: true });

	return fs.writeFile(filepath, data, options);
}
