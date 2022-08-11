const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = env => {

  let mode = "development";
  let devtool = 'eval-source-map';

  // Prod environment
  if (env.NODE_ENV === 'prod') {
    devtool = false;
    mode = 'production';
    // outputPath = `${__dirname}/build/js`;
  };

  return {

    mode: mode,

    entry: path.resolve(__dirname, 'src'),

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js'
    }, 

    devServer: {
      contentBase: path.resolve(__dirname, 'dist'),
    },

    plugins: [
      new HtmlWebpackPlugin({
        title: "three.js VR starter app",
        template: path.resolve(__dirname, 'src/template.html')
      })
    ],

    devtool: devtool

  }

};