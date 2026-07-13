import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // A couple of components intentionally sync local UI state to a prop
      // (e.g. syncing an editor's open/closed state to a `mode` prop) — a
      // common, safe pattern that this newer rule flags. Kept as a warning
      // rather than disabled outright so other misuse still gets caught.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
])
