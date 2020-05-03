module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['prettier'], // Disable eslint rules which are handle by prettier
  plugins: ['prettier'], // Report prettier error as eslint error
  rules: {
    'prettier/prettier': 'error',
  },
}
