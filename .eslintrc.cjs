'use strict';

module.exports = {
  extends: 'ash-nazg/sauron-node-overrides',
  globals: {
    document: 'off',
    fetch: 'off'
  },
  overrides: [
    {
      files: 'public/**',
      extends: 'ash-nazg/sauron-node-overrides',
      plugins: ['html'],
      env: {
        browser: true
      },
      globals: {
        document: true,
        fetch: true
      }
    }
  ],
  settings: {
    jsdoc: {
      mode: 'typescript'
    },
    'html/html-extensions': ['.html', '.htm'],
    polyfills: [
      'Array.isArray',
      'Array.map',
      'console',
      'CustomEvent',
      'document.body',
      'document.querySelector',
      'Event',
      'fetch',
      'JSON',
      'location.href',
      'Map',
      'Number.isNaN',
      'Number.parseInt',
      'Object.defineProperty',
      'Object.entries',
      'Object.fromEntries',
      'Promise',
      'Set',
      'URLSearchParams'
    ]
  },
  parserOptions: {
    ecmaVersion: 2021
  }
};
