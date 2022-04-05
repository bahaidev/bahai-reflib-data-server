import resolve from '@rollup/plugin-node-resolve';

export default [{
  input: 'node_modules/uce-template/esm/index.js',
  output: {
    file: 'public/vendor/uce-template/esm/index.js',
    format: 'es'
  },
  plugins: [
    resolve()
  ]
}, {
  input: 'node_modules/uce-loader/esm/index.js',
  output: {
    file: 'public/vendor/uce-loader/esm/index.js',
    format: 'es'
  },
  plugins: [
    resolve()
  ]
}];
