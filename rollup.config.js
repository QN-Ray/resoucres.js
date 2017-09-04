import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: './src/index.js',
  output: {
    file: './dist/index.js',
    format: 'umd',
    name: 'pageload',
    sourcemap: true
  },
  plugins: [
    commonjs()
  ]
};
