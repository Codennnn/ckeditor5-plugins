module.exports = {
  extends: [require.resolve('prefer-code-style/stylelint')],
  rules: {
    'color-function-notation': 'modern',
    'selector-class-pattern': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],
    'alpha-value-notation': 'number',
  },
  ignoreFiles: ['build/**/*.css'],
  customSyntax: 'postcss-less',
};
