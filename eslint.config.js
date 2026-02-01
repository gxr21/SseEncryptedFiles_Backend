import js from '@eslint/js'
import globals from 'globals'
import prettier from 'eslint-plugin-prettier'
import importPlugin from 'eslint-plugin-import'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  js.configs.recommended,
  {
    files: ['**/*.js'],

    ignores: ['node_modules', 'dist', 'build', 'coverage'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      globals: {
        ...globals.node,
        ...globals.browser,
        console: 'readonly',
        process: 'readonly'
      }
    },

    plugins: {
      prettier,
      import: importPlugin
    },

    rules: {
      // قواعد عامة
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'prefer-const': 'warn',
      eqeqeq: 'warn',
      curly: 'warn',

      // import rules
      'import/no-unresolved': 'off',
      'import/no-extraneous-dependencies': 'off',

      // prettier
      'prettier/prettier': 'error'
    }
  }
])