/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    valo: './src/valo.ts',
    playground: './playground/index.js',
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    open: true,
    overlay: true,
    compress: false,
    port: 9000
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
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
    libraryExport: 'default',
    libraryTarget: 'commonjs',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'playground', 'index.html'),
      filename: 'index.html'
    }),
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'playground/examples'), to: 'examples' },
      ],
    })
  ]
};