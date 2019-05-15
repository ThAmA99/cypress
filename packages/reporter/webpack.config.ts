import webpack, { Configuration, optimize, ResolvePlugin } from 'webpack'
import _ from 'lodash'
import path from 'path'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import sassGlobImporter = require('node-sass-globbing')
import HtmlWebpackPlugin = require('html-webpack-plugin')
import CopyWebpackPlugin = require('copy-webpack-plugin')
import MiniCSSExtractWebpackPlugin = require('mini-css-extract-plugin')

const mode = process.env.NODE_ENV as ('development' | 'production' | 'test' | 'reporter') || 'development'
const webpackmode = mode === 'production' ? mode : 'development'

const isDevServer = !!process.env.DEV_SERVER
const config: webpack.Configuration = {
	entry: {
		cypress_reporter: ['./src']
	},


  mode: webpackmode,
  node: {
    fs: 'empty',
    child_process: 'empty',
    net: 'empty',
    tls: 'empty',
    module: 'empty'
  },
  resolve: {
    extensions: [ '.ts', '.js', '.jsx', '.tsx', '.coffee', '.scss', '.json'],
	},
	output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
    devtoolModuleFilenameTemplate: '[namespace]/[resource-path]'
	},


  // Enable source maps
  // devtool: 'inline-cheap-module-source-map',

  stats: {
    errors: true,
    warningsFilter: /node_modules\/mocha\/lib\/mocha.js/,
    warnings: true,
    all: false,
    builtAt: true,
    colors: true,
    modules: true,
    maxModules: 20,
    excludeModules: /main.scss/,
  },

  module: {
    rules: [
      {
        test: /\.coffee/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve('coffee-loader'),
        },
      },
      {
        test: /\.(ts|js|jsx|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            plugins: [
              // "istanbul",
              [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
              [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
            ],
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
            babelrc: false,
          },
        },
      },
      {
        test: /\.s?css$/,
        exclude: /node_modules/,
        use: [
          { loader: MiniCSSExtractWebpackPlugin.loader },
          {
            loader: 'css-loader',
            options: {
              // sourceMap: true,
              modules: false,
            },
          }, // translates CSS into CommonJS
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              importer: sassGlobImporter,
            },
          }, // compiles Sass to CSS, using Node Sass by default
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './fonts/[name].[ext]',
            },
          },
        ],
      },
    ],
  },

	plugins: [
		new HtmlWebpackPlugin({
			template: './static/index.html',
			chunks: ['cypress_reporter']
		}),
		new CleanWebpackPlugin(),
		// new CopyWebpackPlugin([{ from: './static/fonts', to: 'fonts' }]),
		new MiniCSSExtractWebpackPlugin(),
	],

}

export default config
