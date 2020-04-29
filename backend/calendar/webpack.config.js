const path = require('path')

const BundleTracker = require('webpack-bundle-tracker')
const { VueLoaderPlugin } = require('vue-loader')
const autoprefixer = require('autoprefixer')

module.exports = {
    mode: 'development',
    entry: [
        './frontend/main.js'
    ],
    output: {
        path: path.resolve('./assets/dist'),
        filename: '[name]-[hash].js',
    },
    devtool: process.env.NODE_ENV == 'production' ? undefined : 'eval',
    optimization: {
        minimize: process.env.NODE_ENV == 'production',
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.(scss|css)$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                },{
                    loader: 'postcss-loader',
                    options: {
                        plugins: [
                            autoprefixer({
                                browsers:['ie >= 8', 'last 4 version']
                            })
                        ],
                        sourceMap: true
                    }
                }, {
                    loader: "sass-loader"
                }]
            },
            {
                test: /\.pug$/,
                oneOf: [
                  // this applies to `<template lang="pug">` in Vue components
                  {
                    resourceQuery: /^\?vue/,
                    use: ['pug-plain-loader']
                  },
                  // this applies to pug imports inside JavaScript
                  {
                    use: ['raw-loader', 'pug-plain-loader']
                  }
                ]
              }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new BundleTracker({filename: './webpack-stats.json'})
    ],
    resolve: {
        extensions: ['*', '.js', '.vue', '.json'],
        alias: {
            vue: 'vue/dist/vue.js'
        }
    }
}
