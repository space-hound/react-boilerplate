const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const SRC = ($path = '') => path.resolve(__dirname, 'src/', $path);
const DIST = ($path = '') => path.resolve(__dirname, 'dist/', $path);

module.exports = {

	mode: 'development',

	entry: {
		index: SRC('index.js'),
	},

	output: {
		path: DIST(),
		clean: true,
		filename: 'js/[name].js',
		chunkFilename: 'js/[name].chunk.js',
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

	devtool: 'eval-source-map',

	devServer: {
		hot: true,
		open: true,
	},

	performance: {
		hints: 'warning',
	},

	optimization: {
		splitChunks: {
			chunks: 'all',
		},
	},

	plugins: [
		new HtmlWebpackPlugin({
			inject: true,
			template: SRC('index.html'),
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
					'style-loader',
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
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							modules: {
								mode: 'local',
								localIdentName: '[name]__[local]--[hash:base64:5]',
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
					filename: 'images/[name][ext]',
				},
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name][ext]',
				},
			},
		]
	}
}
