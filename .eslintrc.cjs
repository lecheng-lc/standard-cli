module.exports = {
  extends: ['standard', 'prettier'],
  env: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'default-param-last': 'off',
    'padding-line-between-statements': 'off',
    'no-eq-null': 'off',
    eqeqeq: [
      'error',
      'always',
      {
        null: 'ignore',
      },
    ],
  },
}
