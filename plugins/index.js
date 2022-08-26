import { inspect } from 'node:util';
import process from 'node:process';
import { date } from './date-filter.js';

export const filters = {
	date,
	/** @type {import("../lib/nunjucks").Filter} */
	log(content, args, kwargs) {
		kwargs.depth ??= args[0] ?? 2;
		kwargs.compact ??= args[1] ?? false;

		console.error(inspect(content?.valueOf() ?? content, {
			depth: kwargs.depth,
			compact: kwargs.compact,
			colors: process.stderr.hasColors(),
		}));
	},
	/**
	 *
	 * Turn a number into an ordinal, such as "1" => "1st"
	 * @param {number} n
	 * @returns {string}
	 */
	ordinal(n) {
		const s = n.toString();

		switch (s.at(-1)) {
			case '1':
				return s + 'st';
			case '2':
				return s + 'nd';
			case '3':
				return s + 'rd';
			default:
				return s + 'th';
		}
	},
	// ==== jinja stuff ====
	/**
	 * @template {Record<string, any>} T
	 * @template {keyof T} O
	 * @param {T} object
	 * @param {[O]} args
	 * @returns {T[O]}
	 */
	attr(object, [name]) {
		return object[name];
	},
};

export const functions = {
	class(...groups) {
		// Combine arrays of classes as `one two | three`
		return groups.flatMap(g => {
			if (Array.isArray(g)) {
				const gg = g.filter(Boolean);
				return gg.length > 0 ? gg.join(' ') : [];
			}

			return g ?? [];
		}).join(' | ');
	},
};
