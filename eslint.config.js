import js from '@eslint/js'
import globals from 'globals'
// import tseslint from 'typescript-eslint' // 추후 사용
// import pluginReact from 'eslint-plugin-react' // 추후 사용
import { defineConfig } from 'eslint/config'

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        plugins: { js },
        extends: ['js/recommended'],
    },
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        languageOptions: { globals: globals.browser },
    },
    // tseslint.configs.recommended,
    // pluginReact.configs.flat.recommended,
    {
        rules: {
            'no-unused-vars': 'warn',
            'no-undef': 'error',
        },
    },
])
