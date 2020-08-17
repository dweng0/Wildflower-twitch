const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
   rules: [
     {
       test: /\.ts?$/,
       use: 'ts-loader',
       exclude: /node_modules/,
     },
   ],
 },
 resolve: {
   extensions: [ '.ts', '.js' ],
 },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [new HtmlWebpackPlugin({
    title: "Wildflower"
  })],
  optimization: {
    splitChunks:{
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/](babylonjs)[\\/]/,
          name: 'vendors',
          chunks: 'all',
          reuseExistingChunk:true
        },
        core: {
          test: /[\\/]src[\\/]/,
          name: 'game',
          chunks: 'all',
          maxSize: 1024,
          minChunks: 2,
        }
      }
    }
  }
};
