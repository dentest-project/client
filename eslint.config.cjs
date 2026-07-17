const js = require('@eslint/js')
const tsParser = require('@typescript-eslint/parser')
const vue = require('eslint-plugin-vue')
const prettier = require('eslint-config-prettier')
const prettierPlugin = require('eslint-plugin-prettier')

module.exports = [
  {
    ignores: [
      '.nuxt/**',
      '.output/**',
      'node_modules/**'
    ]
  },
  js.configs.recommended,
  ...vue.configs['flat/essential'],
  {
    files: [
      '**/*.{ts,tsx}'
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'off'
    }
  },
  {
    files: [
      '**/*.vue'
    ],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        parser: tsParser,
        sourceType: 'module'
      }
    },
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'off'
    }
  },
  {
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      'prettier/prettier': 'error'
    }
  },
  prettier
]
