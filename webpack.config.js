/* eslint-disable */
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env, args) => {
	const mode = args.mode || "development";
	const isDevelopment = mode === 'development';
	console.log('Webpack mode: ' + mode)
	return {
		mode: mode,
		entry: {
			main: './index.js'
		},
		watch: isDevelopment,
		output: {
			filename: isDevelopment ? '[name].bundle.js' : '[name]_[hash].bundle.js',
			path: path.resolve(__dirname, 'dist'),
			publicPath: '/',
		},
		resolve: {
			modules: [
				'node_modules',
			],
			extensions: ['.js', '.jsx', '.css'],
			alias: {
				'@modules': path.resolve(__dirname, 'node_modules'),
				'three': path.resolve(__dirname, 'node_modules', 'three', 'build', 'three.js'),
			},
		},
		devtool: 'eval',
		target: 'web',
		plugins: [
			new webpack.LoaderOptionsPlugin({
				debug: true,
			}),
			new webpack.EnvironmentPlugin({
				NODE_ENV: 'development',
				DEBUG: true,
			}),
			new HtmlWebpackPlugin({
				filename: path.resolve(__dirname, 'dist', 'index.html'),
				template: path.resolve(__dirname, 'index.html'),
				inject: true,
				chunks: ['main', 'commons'],
				chunksSortMode: 'manual',
			}),
			new webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery',
				Modernizr: 'modernizr'
			}),
			// new BundleAnalyzerPlugin()
		],
		module: {
			rules: [{
					test: /\.jsx?$/,
					include: [__dirname],
					exclude: [/node_modules/, /modernizr-custom\.js/],
					use: [{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
						}
					}, {
						loader: 'eslint-loader',
					}]
				},
				{
					test: /\.ts$/,
					include: [__dirname],
					exclude: /node_modules/,
					use: ['babel-loader', 'ts-loader'],
				},
				{
					test: /\.(jpg|png|svg)$/,
					loader: 'file-loader',
					options: {
						outputPath: './images',
					},
				},
				{
					test: /\.(gif|mp4|webm)$/,
					loader: 'file-loader',
					options: {
						outputPath: './videos',
					},
				},
				{
					test: /\.(ttf|eot|woff|woff2)$/,
					loader: 'file-loader',
					options: {
						outputPath: './fonts',
					},
				},
				{
					test: /\.(scss)$/,
					use: ['style-loader', 'css-loader', 'sass-loader']
				},
				{
					test: /\.(css)$/,
					use: ['style-loader', 'css-loader']
				}
			],
		},
		devServer: {
			contentBase: path.join(__dirname),
			compress: true,
			port: 9000,
			host: 'localhost',
			hot: true,
		},
		optimization: {
			minimizer: isDevelopment ? [
				new UglifyJSPlugin({
					sourceMap: true,
					uglifyOptions: {
						output: {
							comments: false,
							beautify: false
						},
					}
				})
			] : [],
			splitChunks: {
				maxAsyncRequests: 5,
				cacheGroups: {
					commons: {
						name: 'commons',
						chunks: 'all',
						minChunks: 2,
						minSize: 0
					}
				}
			}
		}
	}
}
