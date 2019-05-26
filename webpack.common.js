const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = [
  {
    entry: './src/index.ts',
    target: 'web',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: 'src/index.html'
      }),
      new CopyPlugin([
        { from: 'maps', to: '.' },
        { from: 'images', to: 'images' },
        { from: 'css', to: 'css' },
      ]),
    ],
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist', 'client')
    }
  }, {
    entry: './src/server.ts',
    target: 'node',
    node: {
      __dirname: false
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ]
    },
    plugins: [
      new CleanWebpackPlugin()
    ],
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist', 'server')
    }
  }
];