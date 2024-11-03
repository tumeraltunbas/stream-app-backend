const tseslint = require('typescript-eslint')

module.exports  = tseslint.config(
    ...tseslint.configs.recommended,
    {
        ignores: ['dist', 'node_modules', 'eslint.config.js'],
    }
)