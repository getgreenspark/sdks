const path = require('path');
const Dotenv = require('dotenv-webpack');
var PACKAGE = require('./package.json');

module.exports = (env, { mode }) => {
  const isProduction = mode === 'production'

  return {
    entry: {
      'latest': './src/index.ts',
      [PACKAGE.version]: './src/index.ts',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src/'),
      },
    },
    output: {
      filename: isProduction ? 'widgets@[name].js' : 'dev-bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new Dotenv()
    ]
  };
};