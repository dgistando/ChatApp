const uglify = require('uglifyjs-webpack-plugin')

module.exports = {
    mode : 'development',
    entry: './src/index.js',
    output: {
        path: __dirname,
        publicPath: '/',
        filename: 'bundle.js'
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['env','react']
              }
            }
          },
          {
            test:/\.css$/,
            //Webpack executes loaders in reverse order so css comes first. >:((
            use:['style-loader','css-loader']
          },
          /*{ //maybe if uploading images. Think about later
            test:/\.(png|jpg|gif|svg|ico|jpeg|PNG|jpg_256)$/,
            use:[
              {
                loader:'file-loader',
                options : {
                  name: '[path][name]-[hash:8].[ext]'
                },
              }
            ]
          }*/
        ]
      },
    plugins : [//handles code post download 
        new uglify()
    ],
    resolve: {
      extensions: ['.js', '.jsx']
    },
    devServer: {
      historyApiFallback: true,
      contentBase: './public/'
    }
};