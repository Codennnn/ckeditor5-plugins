const { TYPESCRIPT_FILES } = require('prefer-code-style/constants');

module.exports = {
  root: true,

  extends: [
    require.resolve('prefer-code-style/eslint/node'),
    require.resolve('prefer-code-style/eslint/browser'),
    require.resolve('prefer-code-style/eslint/typescript'),
  ],

  overrides: [
    {
      files: TYPESCRIPT_FILES,
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
      rules: {
        '@typescript-eslint/no-floating-promises': 0,
        '@typescript-eslint/no-unsafe-enum-comparison': 0,
      },
    },
    {
      files: ['tests/**/*.[jt]s', 'sample/**/*.[jt]s'],
      rules: {
        // To write complex tests, you may need to import files that are not exported in DLL files by default.
        // Hence, imports CKEditor 5 packages in test files are not checked.
        // 'ckeditor5-rules/ckeditor-imports': 0,
      },
    },
  ],

  ignorePatterns: [
    // Ignore the entire `build/` (the DLL build).
    'build/**',
    // Ignore compiled JavaScript files, as they are generated automatically.
    'src/**/*.js',
    // Also, do not check typing declarations, too.
    'src/**/*.d.ts',
  ],
};
