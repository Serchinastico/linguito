import {FlatCompat} from '@eslint/eslintrc'
import eslint from '@eslint/js'
import pluginChaiFriendly from 'eslint-plugin-chai-friendly'
import perfectionist from 'eslint-plugin-perfectionist'
import prettier from 'eslint-plugin-prettier'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import tseslint from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  allConfig: eslint.configs.all,
  baseDirectory: __dirname,
  recommendedConfig: eslint.configs.recommended,
})

const prettierConfig = compat.extends('prettier')

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...prettierConfig,
  pluginChaiFriendly.configs.recommendedFlat,
  perfectionist.configs['recommended-natural'],
  {
    ignores: ['dist', 'bin', 'test/fixtures'],
  },
  {
    plugins: {
      prettier,
    },
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
      'no-await-in-loop': 'off',
      'perfectionist/sort-imports': 'error',
      'perfectionist/sort-objects': 'error',
      'prettier/prettier': 'error',
    },
  },
)
