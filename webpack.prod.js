/* eslint-disable prettier/prettier */

const path = require('path');

const webpack = require('webpack');

const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const SRC = ($path = '') => path.resolve(__dirname, 'src/', $path);
const DIST = ($path = '') => path.resolve(__dirname, 'dist/', $path);

module.exports = {

	mode: 'production',

	entry: {
		index: SRC('index.js'),
	},

	output: {
		path: DIST(),
		clean: true,
		filename: 'js/[name].[chunkhash].js',
		chunkFilename: 'js/[name].[chunkhash].chunk.js',
	},

	resolve: {
		modules: [
			SRC(),
			'node_modules'
		],
		extensions: [
			'.js',
			'.jsx'
		],
	},

	devtool: 'source-map',

	devServer: {
		port: 3000,
		hot: true,
		open: true,
		compress: true,
	},

	performance: {
		hints: false,
	},

	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					warnings: false,
					compress: {
						comparisons: false,
					},
					parse: {},
					mangle: true,
					output: {
						comments: false,
						ascii_only: true,
					},
					sourceMap: true,
				},
				parallel: true,
			}),
			new CssMinimizerPlugin({
				parallel: true,
			}),
		],
		nodeEnv: 'production',
		sideEffects: true,
		concatenateModules: true,
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all',
			maxInitialRequests: 10,
			minSize: 0,
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: (module) => {
						const packageName = module.context.match(
							/[\\/]node_modules[\\/](.*?)([\\/]|$)/,
						)[1];
						return `npm.${packageName.replace('@', '')}`;
					},
				},
			},
		},
	},

	plugins: [
		new HtmlWebpackPlugin({
			inject: true,
			template: SRC('index.html'),
			minify: {
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true,
				removeComments: true,
				useShortDoctype: true,
				keepClosingSlash: true,
				collapseWhitespace: true,
				removeEmptyAttributes: true,
				removeRedundantAttributes: true,
				removeStyleLinkTypeAttributes: true,
			},
		}),
		new MiniCssExtractPlugin({
			filename: 'css/[name].[chunkhash].css',
			chunkFilename: 'css/[name].[chunkhash].chunk.css',
		}),
		new CompressionPlugin({
			test: /\.js$|\.css$|\.html$/,
			algorithm: 'gzip',
			threshold: 10240,
			minRatio: 0.8,
		}),
		new webpack.ids.HashedModuleIdsPlugin({
			hashFunction: 'sha256',
			hashDigest: 'hex',
			hashDigestLength: 20,
		}),
	],

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
			{
				test: /\.jsx$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
			{
				test: /\.(sa|sc|c)ss$/,
				exclude: [
					/\.module\.(sa|sc|c)ss$/,
					/node_modules/,
				],
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
						},
					},
					'sass-loader',
				],
			},
			{
				test: /\.module\.(sa|sc|c)ss$/,
				exclude: /node_modules/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							modules: {
								mode: 'local',
								localIdentName: '[name]__[local]--[hash:base64:10]',
							},
						},
					},
					'sass-loader',
				],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'images/[name].[hash][ext]',
				},
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name].[hash][ext]',
				},
			},
		]
	}
}
