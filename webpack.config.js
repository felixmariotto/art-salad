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

    entry: {
      'bundle': path.resolve(__dirname, 'src'),
    },

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js'
    }, 

    devServer: {
      static: path.resolve(__dirname, 'dist'),
    },

    plugins: [
      new HtmlWebpackPlugin({
        title: "three.js VR starter app",
        template: path.resolve(__dirname, 'src/template.html')
      })
    ],

    module: {
      rules: [
        {
          test: /\.(gltf|glb|png|svg|jpg|gif)$/,
          use: [
            'file-loader',
          ],
        },
      ],
    },

    devtool: devtool,

    resolve: {
      alias: {
        'three-mesh-ui': path.resolve( __dirname, 'node_modules/three-mesh-ui/src/three-mesh-ui.js' ),
      },
    },

  }

};