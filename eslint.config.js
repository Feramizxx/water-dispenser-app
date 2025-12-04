import geodevConfig from '@dataport/eslint-config-geodev';
import typescriptParser from '@typescript-eslint/parser';
import vueParser from 'vue-eslint-parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import vuePlugin from 'eslint-plugin-vue';

export default [
  {
    ignores: ['node_modules/**', 'dist/**', '*.config.js', '*.config.ts'],
  },
  ...geodevConfig,
  ...vuePlugin.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: typescriptParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        HTMLElement: 'readonly',
        HTMLDivElement: 'readonly',
        document: 'readonly',
        window: 'readonly',
        console: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      'vue': vuePlugin,
    },
    rules: {
      // Vue specific rules
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'warn',
      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
			globals: {
				HTMLElement: 'readonly',
				document: 'readonly',
				window: 'readonly',
				console: 'readonly',
			},
		},
		plugins: {
			'@typescript-eslint': typescriptPlugin,
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/explicit-function-return-type': 'off',
		},
	},
];

