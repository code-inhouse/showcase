const path = require('path')

const webpack  =require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
var BundleTracker = require('webpack-bundle-tracker');
const globalSass = './frontend/marketwatch/scss/globals.scss';

const isProd = process.env.NODE_ENV === 'production'

const getLoaders = ( prod ) => {
  return [
    'vue-style-loader',
    'css-loader',
    'postcss-loader',
    {
      loader: 'sass-loader',
      options: {
        data: `
          @import "${globalSass}";
        `
      }
    }

  ];
}

module.exports = {
  mode: 'development',
  entry: {
    main: path.join(__dirname, 'frontend', 'main.js'),
    login: path.join(__dirname, 'frontend', 'login.js'),
  },
  output: {
    path: path.join(__dirname, 'static', 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: getLoaders(false)
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        VERSION: JSON.stringify(require("./package.json").version),
        PROXY_URL: JSON.stringify(process.env.PROXY_URL || 'https://cors.aggr.trade/'),
        API_URL: JSON.stringify(process.env.API_URL || 'https://priceapi.lunarlabs.ai/btc/{pair}/historical/{from}/{to}/{timeframe}/'),
        API_SUPPORTED_PAIRS: JSON.stringify(['BTCUSD'])
      }
    }),
    new VueLoaderPlugin({
      runtimeCompiler: true
    }),
    new BundleTracker({ filename: 'webpack-stats.json' })
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  }
}
