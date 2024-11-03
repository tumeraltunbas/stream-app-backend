import tseslint from 'typescript-eslint'

const eslintConfig = tseslint.config(
    ...tseslint.configs.recommended,
    {
        ignores: ['dist/', 'node_modules/']
    }
)

export default eslintConfig;