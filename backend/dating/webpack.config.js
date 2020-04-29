const path = require('path')
const webpack = require('webpack')
const extractTextPlugin = require("extract-text-webpack-plugin")
const I18nPlugin = require('i18n-webpack-plugin')
var CompressionPlugin = require("compression-webpack-plugin")


const srcFolder = path.join(__dirname, 'src', 'frontend', 'js')

const languages = {
    ru: null,
    en: require('./src/frontend/i18n/en.json')
}

let plugins = [
  new extractTextPlugin("./css/[name].css"),
  new webpack.DefinePlugin({
    'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || "development")
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'js/commonChunk',
    chunks: ['js/profile', 'js/chat', 'js/news']
  }),
  new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en-gb|ru)$/),
  new CompressionPlugin({
    asset: "[path].gz[query]",
    algorithm: "gzip",
    test: /\.js$|\.html$/,
    threshold: 10240,
    minRatio: 0.8
  }),
]

if (process.env.ENV == 'production' ||
    process.env.NODE_ENV == 'production') {
    plugins.push(new webpack.optimize.UglifyJsPlugin())
}

module.exports = Object.keys(languages).map(lang => ({
    entry: {
        'js/profile': path.join(srcFolder, 'profile', 'index.js'),
        'js/registration': path.join(srcFolder, 'registration', 'index.js'),
        'js/confirmation': path.join(srcFolder, 'confirmation', 'index.js'),
        'js/matches': path.join(srcFolder, 'matches', 'index.js'),
        'js/chat': path.join(srcFolder, 'chat', 'index.js'),
        'js/pinger': path.join(srcFolder, 'pinger.js'),
        'js/sympathies': path.join(srcFolder, 'sympathies.js'),
        'js/news': path.join(srcFolder, 'news', 'index.js'),
        'js/main': path.join(srcFolder, 'main.js'),
        'js/polyfill': 'babel-polyfill',
        'js/payments': path.join(srcFolder, 'payments', 'index.js'),
        'js/moderator-feedbacks': path.join(srcFolder, 'moderator', 'moderator-feedbacks', 'index.js'),
        'js/moderator-photos': path.join(srcFolder, 'moderator', 'moderator-photos', 'index.js'),
        'js/settings': path.join(srcFolder, 'settings', 'index.js'),
        'common': path.join(srcFolder, 'common', 'bundle.js')
    },
    output: {
        path: path.join(__dirname, 'src', 'static', 'compiled'),
        filename: (lang == 'ru' ? '' : `${lang}.`)  + '[name].js'
    },
    devtool: process.env.ENV == 'development' ? '#eval' : null,
    module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel', // 'babel-loader' is also a valid name to reference
            query: {
                presets: ['es2015', 'stage-0', 'react'],
                plugins: ['transform-class-properties']
            }
          },
          {
            test: /\.scss$/,
            loader: extractTextPlugin.extract("style", "css!sass")
           }
       ]
    },
    plugins: [...plugins, new I18nPlugin(languages[lang])]
}))
