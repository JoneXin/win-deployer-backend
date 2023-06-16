const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// fork-ts-checker-webpack-plugin需要单独安装
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const disRootPath = path.resolve(__dirname, 'release/win_deployer');
const WebpackBar = require('webpackbar');
var nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: {
        main: './src/main',
        script: './script/service.js',
    },
    // 打包后的文件名称以及位置
    output: {
        filename: '[name].js',
        path: disRootPath,
        // 自动清空上次打包结果
        clean: true,
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                        return `node_modules/${packageName.replace('@', '')}`;
                    },
                    reuseExistingChunk: true,
                },
                // config: {
                //     test: /[\\/]script[\\/]/,
                //     name: 'script',
                //     // 选项：true/false。为true时，如果当前要提取的模块，在已经在打包生成的js文件中存在，则将重用该模块，而不是把当前要提取的模块打包生成新的js文件。
                //     reuseExistingChunk: true,
                // },
            },
        },
    },
    target: 'node',
    context: __dirname,
    node: {
        __filename: false,
        __dirname: false
    },
    externals: {
        "node-windows": "commonjs node-windows"
    },
    // ts文件的处理
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: {
                    loader: 'ts-loader',
                    options: { transpileOnly: true },
                },
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.ts', '.json'],
        alias: {
            src: path.resolve(__dirname, 'src'),
        },
    },
    plugins: [
        // 需要进行忽略的插件
        new webpack.IgnorePlugin({
            checkResource(resource) {
                const lazyImports = [
                    '@nestjs/platform-socket.io',
                    '@nestjs/microservices',
                    '@nestjs/microservices/microservices-module',
                    '@nestjs/websockets/socket-module',
                    'cache-manager',
                    'class-validator',
                    'class-transformer',
                    'pg-hstore',
                ];
                if (!lazyImports.includes(resource)) {
                    return false;
                }
                try {
                    require.resolve(resource, {
                        paths: [process.cwd()],
                    });
                } catch (err) {
                    return true;
                }
                return false;
            },
        }),
        new webpack.DefinePlugin({
            'global.NODE_ENV': JSON.stringify('production'),
        }),
        new ForkTsCheckerWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'public',
                    to: path.resolve(disRootPath, 'public'),
                },
                {
                    from: 'config',
                    to: path.resolve(disRootPath, 'config'),
                },
                {
                    from: 'sql',
                    to: path.resolve(disRootPath, 'sql'),
                },
                {
                    from: '.running',
                    to: path.resolve(disRootPath, '.running'),
                },
                {
                    from: 'package.json',
                    to: path.resolve(disRootPath, 'package.json'),
                },
                {
                    from: 'node_modules/node-windows',
                    to: path.resolve(disRootPath, 'node_modules/node-windows'),
                },
            ],
        }),
        new WebpackBar({
            color: "#85d",  // 默认green，进度条颜色支持HEX
            basic: false,   // 默认true，启用一个简单的日志报告器
            profile: false,  // 默认false，启用探查器。
        })
    ],
};
