const CopyPlugin = require('../../node_modules/copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: `${__dirname}/src/main.ts`,
    target: 'node',
    output: {
        filename: 'main.js',
        path: `${__dirname}/dist`
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    externals: [/node_modules/, 'bufferutil', 'utf-8-validate'],
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'src/assets', to: 'assets' },
            ]
        })
    ]
};
