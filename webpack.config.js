const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// fork-ts-checker-webpack-plugin需要单独安装
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const disRootPath = path.resolve(__dirname, 'release/win_deployer');

module.exports = {
    entry: {
        main: './src/main',
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
                        // get the name. E.g. node_modules/packageName/not/this/part.js
                        // or node_modules/packageName
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                        // bull存在一些指令 需要一起同步
                        if (packageName === 'bull') {
                            return `node_modules/bull/index`;
                        }
                        // npm package names are URL-safe, but some servers don't like @ symbols
                        return `node_modules/${packageName.replace('@', '')}`;
                    },
                    reuseExistingChunk: true,
                },
                config: {
                    test: /[\\/]config[\\/]/,
                    name: 'config',
                    // 选项：true/false。为true时，如果当前要提取的模块，在已经在打包生成的js文件中存在，则将重用该模块，而不是把当前要提取的模块打包生成新的js文件。
                    reuseExistingChunk: true,
                },
                configEnv: {
                    test: (module) => {
                        const rule = new RegExp(/config\\config.(\S*).ts/, 'g');
                        return (module.request || '').match(rule)?.length > 0;
                    },
                    name: (module) => {
                        return '../config/' + path.parse(module?.request || '').name;
                    },
                    priority: 1,
                },
            },
        },
    },
    target: 'node',
    // 置为空即可忽略webpack-node-externals插件
    externals: {
        // mysql2: mysql2,
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
                // {
                //     from: 'node_modules/bull/lib/commands',
                //     to: path.resolve(disRootPath, 'node_modules', 'bull'),
                // },
                {
                    from: 'public',
                    to: path.resolve(disRootPath, 'public'),
                },
                {
                    from: 'config',
                    to: path.resolve(disRootPath, 'config'),
                },
                {
                    from: 'script',
                    to: path.resolve(disRootPath, 'script'),
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
            ],
        }),
    ],
};
