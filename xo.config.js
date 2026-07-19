/** @type {import('xo').FlatXoConfig} */
const config = [
	{
		rules: {
			'max-len': ['error'],
			'object-curly-spacing': ['error', 'always'],
		},
	}, {
		files: '**/*.ts',
		rules: {
			'@typescript-eslint/no-redundant-type-constituents': 'off',
			'object-curly-spacing': ['error', 'always'],
			'@typescript-eslint/consistent-type-definitions': [
				'error', 'interface',
			],
		},
	},
];

export default config;
