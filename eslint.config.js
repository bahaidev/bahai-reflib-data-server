import ashNazg from 'eslint-config-ash-nazg';

export default [
  {
    ignores: [
      'public/vendor'
    ]
  },
  ...ashNazg(['sauron', 'node']).map((cfg) => {
    return {
      ignores: ['public/**'],
      ...cfg
    };
  }),
  ...ashNazg(['sauron', 'browser']).map((cfg) => {
    return {
      ...cfg,
      files: ['public/**'],
      settings: {
        ...cfg.settings,
        'html/html-extensions': ['.html', '.htm']
      }
    };
  })
];
