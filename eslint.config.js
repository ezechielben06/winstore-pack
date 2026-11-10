// 📄 eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // ✅ Ignore les dossiers de build
  globalIgnores(['dist', 'node_modules', 'coverage']),

  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      // ✅ Flat config recommandée pour react-hooks (ESLint 9)
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // ✅ Réduit le bruit : variables non utilisées = warning (sauf args _)
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      // ✅ Autorise les composants non utilisés dans JSX (faux positifs fréquents)
      'no-undef': 'error',
      // ✅ Interdit les console.log en prod (warning pour t'en rappeler)
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // ✅ Bonne pratique React
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // ✅ Autorise les exports multiples (composants + helpers)
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
])