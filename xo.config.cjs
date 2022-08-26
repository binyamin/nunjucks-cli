/**
 * @type {import('xo').Options}
 */
const config = {
	rules: {
		'max-len': ['error'],
		'object-curly-spacing': ['error', 'always'],
	},
	overrides: [
		{
			files: '**/*.ts',
			rules: {
				'@typescript-eslint/no-redundant-type-constituents': 'off',
				'@typescript-eslint/object-curly-spacing': ['error', 'always'],
				'@typescript-eslint/consistent-type-definitions': [
					'error', 'interface',
				],
			},
		},
	],
};

module.exports = config;
