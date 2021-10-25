const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    'json-ptr.tests': './src/__tests__/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist.browser'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        include: [path.resolve(__dirname, 'src')],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: 'source-map',
};
