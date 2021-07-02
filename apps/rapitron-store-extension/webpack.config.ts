import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
import path from 'path';

const isDevelopment = true;

const config = {
    mode: 'development',
    devtool: 'source-map',
    entry: {
        index: path.resolve(__dirname, "src", "index.tsx")
    },
    output: {
        path: path.resolve(__dirname, "extension/devtools/dist")
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src", "index.html")
        }),
        new MiniCssExtractPlugin({
            filename: isDevelopment ? '[name].css' : '[name].[hash].css',
            chunkFilename: isDevelopment ? '[id].css' : '[id].[hash].css'
        }),
        // new CopyWebpackPlugin({ patterns: [{ from: 'src/assets', to: 'assets' }] }),
        new MonacoWebpackPlugin({
            languages: [
                'json',
                'javascript',
                'typescript'
            ]
        })
    ],
    devServer: {
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react",
                            "@babel/preset-typescript",
                            {
                                plugins: [
                                    "babel-plugin-styled-components",
                                    "babel-plugin-transform-typescript-metadata",
                                    ["@babel/plugin-transform-runtime", { "regenerator": true }],
                                    ["@babel/plugin-proposal-decorators", { "legacy": true }],
                                    ["@babel/plugin-proposal-class-properties", { "loose": true }]
                                ]
                            }
                        ],
                    },
                },
            },
            {
                test: /\.s?css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[local]'
                            }
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".scss", ".js"],
    }
};

export default config;