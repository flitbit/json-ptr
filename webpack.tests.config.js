const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: "production",
  entry: './__tests__/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        include: [
          path.resolve(__dirname, '__tests__'),
          path.resolve(__dirname, 'src'),
        ]
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: [path.resolve(__dirname, 'node_modules')],
    fallback: {
      'util': require.resolve('util/')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser'
    })
  ],
  output: {
    filename: 'json-ptr-with-browser-tests.js',
    path: path.resolve(__dirname, 'dist.browser'),
  },
};
