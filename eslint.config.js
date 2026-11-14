import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import eslintConfigPrettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'

const reactSettings = { react: { version: '18.3' } }
const reactPlugins = {
  react,
  'react-hooks': reactHooks,
  'react-refresh': reactRefresh,
}
const sharedReactRules = {
  ...react.configs.recommended.rules,
  ...react.configs['jsx-runtime'].rules,
  ...reactHooks.configs.recommended.rules,
  'react/jsx-no-target-blank': 'off',
  // Disable prop-types rule project-wide (we prefer TypeScript or manual checks)
  'react/prop-types': 'off',
  'react-refresh/only-export-components': [
    'warn',
    { allowConstantExport: true },
  ],
}

export default tseslint.config(
  { ignores: ['dist'] },

  // JavaScript / JSX (perilaku lama dipertahankan)
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: reactSettings,
    plugins: reactPlugins,
    rules: {
      ...js.configs.recommended.rules,
      ...sharedReactRules,
      // Ignore unused React import warnings (using new JSX runtime)
      'no-unused-vars': ['error', { varsIgnorePattern: '^React$' }],
    },
  },

  // TypeScript / TSX (file baru dari migrasi bertahap)
  {
    files: ['**/*.{ts,tsx}'],
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: reactSettings,
    plugins: reactPlugins,
    rules: {
      ...sharedReactRules,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // Prettier terakhir: matikan rule yang bentrok dengan formatting
  eslintConfigPrettier
)
