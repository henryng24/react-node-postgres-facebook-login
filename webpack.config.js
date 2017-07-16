const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const source = path.resolve(__dirname, 'app');
const target = path.resolve(__dirname, 'dist');

const config = {
  entry: [source + '/index.jsx'],
  output: {
    path: target,
    filename: 'fun.bundle.js'
  },
  module: {
    loaders: [
    {
      test: /\.jsx$/,
      include: source,
      exclude: /node_modules/,
      loader: 'babel-loader'
    },
    {
     test: /\.css/,
     loaders: ExtractTextPlugin.extract('css-loader')
    }],
  },
  plugins: [
    new webpack.DefinePlugin({
      API_HOST: setupApiHost()
    }),
    new ExtractTextPlugin('styles.css')
  ]
};

function setupApiHost() {
  switch (process.env.DEPLOY_ENV) {
    default:
      return "'http://localhost:3000/'";
  }
}

module.exports = config;