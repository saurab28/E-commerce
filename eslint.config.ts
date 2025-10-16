import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import * as pluginVue from 'eslint-plugin-vue'
// import * as pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import { globalIgnores } from 'eslint/config'
import js from '@eslint/js'
import globals from 'globals'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
  },
  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),
  js.configs.recommended,
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  {
    rules: {
      'oxlint/no-console': 'warn',
      'oxlint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  skipFormatting,
)
