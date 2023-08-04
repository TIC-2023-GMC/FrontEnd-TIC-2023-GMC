module.exports = {
	root: true,
	env: {
		browser: true,
		es6: true,
		node: true,
		jest: true,
		'react-native/react-native': true
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:react-native/all'
	],
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 2021,
		sourceType: 'module',
		tsconfigRootDir: __dirname
	},
	plugins: ['react', 'react-native'],
	rules: {
		// Aquí puedes personalizar las reglas de ESLint según tus preferencias
		'react-native/no-unused-styles': 'off',
		'react-native/split-platform-components': 'error',
		'react-native/no-inline-styles': 'off',
		'react-native/no-raw-text': 'off',
		'react-native/no-single-element-style-arrays': 'error',
		'react-native/sort-styles': 'off',
		'react-native/no-color-literals': 'off',
		'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'react/no-unused-prop-types': 'error'
	}
};
