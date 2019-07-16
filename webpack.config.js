let debug = process.env.NODE_ENV !== 'production';
const path = require('path');
const nodeExternals = require('webpack-node-externals');

const babelLoader = {
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-env', '@babel/preset-react']
  }
}

const frontendConfig = {
  //devtool: debug ? 'inline-source-map' : '',
  mode: debug ? 'development' : 'production',
  entry: {
    remarkable: __dirname + '/src/index.coffee'
  },
  watch: false,
  output: {
    path: path.resolve(__dirname, 'lib'),
    publicPath: '/assets',
    filename: debug ? 'remarkable.js' : 'remarkable.min.js'
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.coffee$/,
        exclude: /node_modules/,
        use: [babelLoader, 'coffee-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: babelLoader
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              attrs: {
                component: 'remark-defaults'
              }
            }
          },
          'css-loader', // translates CSS into CommonJS
          'sass-loader' // compiles Sass to CSS
        ]
      },
      {
        test: /\.css/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader' // translates CSS into CommonJS
        ]
      }
    ]
  },
  resolve: {
    extensions: [".coffee", ".js", ".scss",".css"]
  },
  optimization: {
    minimize: !debug
  },
  devServer: {
    contentBase: 'build/',
    watchContentBase: true,
    open: true
  }
};

module.exports = frontendConfig;
