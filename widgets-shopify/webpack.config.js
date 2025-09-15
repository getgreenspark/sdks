const path = require('path')
const Dotenv = require('dotenv-webpack')
const PACKAGE = require('./package.json')

const versionedEntries = {
  [PACKAGE.version]: {
    import: './src/index.ts',
    library: { type: 'commonjs-static' },
  },
  [`${PACKAGE.version}-umd`]: {
    import: './src/index.ts',
    library: {
      type: 'umd',
      name: 'GreensparkWidgets',
      umdNamedDefine: true,
    },
  },
}

module.exports = (env, { mode }) => {
  const isProduction = mode === 'production'
  return {
    entry: isProduction
      ? {
          latest: {
            import: './src/index.ts',
            library: {
              type: 'umd',
              name: 'GreensparkWidgets',
              umdNamedDefine: true,
            },
          },
          ...versionedEntries,
        }
      : {
          ...versionedEntries,
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
    },
    output: {
      filename: 'widgets-shopify@[name].js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [new Dotenv({ path: isProduction ? '.env.production' : '.env' })],
  }
}
