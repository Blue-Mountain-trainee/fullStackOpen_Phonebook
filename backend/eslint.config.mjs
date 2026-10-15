import js from '@eslint/js'
import stylisticJS from '@stylistic/eslint-plugin'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {
      js,
      '@stylistic': stylisticJS
    },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
    rules: {
      '@stylistic/object-property-newline': 'error',
      '@stylistic/object-curly-newline': ['error', { ObjectExpression: { minProperties: 2 } }],
      '@stylistic/indent': ['error', 2],
      '@stylistic/linebreak-style': ['error', 'unix'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', {
        before: true,
        after: true
      }],
    }
  },
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs' }
  },
  { ignores: ['**/dist/**'] }
])
