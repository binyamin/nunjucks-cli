import path from 'node:path';

import test from 'ava';
import mock from 'mock-fs';

import yaml from 'js-yaml';

/*
	eslint-disable-next-line import/order --
	import these after 'mock-fs', because they use 'node:fs'
*/
import { readFile } from 'node:fs/promises';

import { run as runApp } from './app.js';

test.before(() => {
	mock({
		src: {
			'index-dir.njk': '{{ range(5) | join(",") }}',
		},
		data: {
			'vars.json': JSON.stringify({ name: 'Bob' }),
			'vars.yaml': yaml.dump({ name: 'Bob' }),
		},
		'with-data.njk': 'Hello {{ vars.name }}!',
		'with-plugins.njk':
			'Today is {{ "2022-01-01" | date("MMMM Do, YYYY") }}',
		'index-root.njk': '{{ range(5) | join(",") }}',
	});
});

test('"source" is a file', async t => {
	await runApp('index-root.njk', 'out');

	const contents = await readFile('out/index-root.html', 'utf8');
	t.is(contents, '0,1,2,3,4');
});

test('"source" is a relative path to a file', async t => {
	await runApp('src/index-dir.njk', 'out');

	const contents = await readFile('out/src/index-dir.html', 'utf8');
	t.is(contents, '0,1,2,3,4');
});

test('"source" is an absolute path to a file', async t => {
	const p = path.resolve('src/index-dir.njk');
	await runApp(p, 'out');

	const contents = await readFile('out/src/index-dir.html', 'utf8');
	t.is(contents, '0,1,2,3,4');
});

test('"source" is a directory', async t => {
	await runApp('src', 'out');

	const contents = await readFile('out/index-dir.html', 'utf8');
	t.is(contents, '0,1,2,3,4');
});

test('"out" is a file', async t => {
	await runApp('index-root.njk', 'output.html');

	const contents = await readFile('output.html', 'utf8');
	t.is(contents, '0,1,2,3,4');
});

test('"out" is a path to a file', async t => {
	await runApp('index-root.njk', 'out/output.html');

	const contents = await readFile('out/output.html', 'utf8');
	t.is(contents, '0,1,2,3,4');
});

test('"data" is a json file', async t => {
	await runApp('with-data.njk', 'out', { data: ['data/vars.json'] });

	const contents = await readFile('out/with-data.html', 'utf8');
	t.is(contents, 'Hello Bob!');
});

test('"data" is a yaml file', async t => {
	await runApp('with-data.njk', 'out', { data: ['data/vars.yaml'] });

	const contents = await readFile('out/with-data.html', 'utf8');
	t.is(contents, 'Hello Bob!');
});

test('internal plugins work', async t => {
	await runApp('with-plugins.njk', 'out');

	const contents = await readFile('out/with-plugins.html', 'utf8');
	t.is(contents, 'Today is January 1st, 2022');
});
