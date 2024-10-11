const path = require('path')
const Dotenv = require('dotenv-webpack')
var PACKAGE = require('./package.json')

module.exports = (env, { mode }) => {
  const isProduction = mode === 'production'
  return {
    entry: isProduction
      ? {
          latest: './src/index.ts',
          [PACKAGE.version]: {
            import: './src/index.ts',
            library: { type: 'commonjs-static' },
          },
        }
      : {
          [PACKAGE.version]: {
            import: './src/index.ts',
            library: { type: 'commonjs-static' },
          },
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
      filename: 'widgets@[name].js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [new Dotenv()],
  }
}
