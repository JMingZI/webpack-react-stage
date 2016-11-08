/**
 * 执行命令：
 * 测试环境：set app=dev&& webpack，打包到彩云的文件夹，不压缩
 * 线上：set app=ms&& webpack -p，设置app=caiyun,masheng,uban,xiaowo即可
 */
var webpack = require("webpack");
var path = require("path");

var version = require('compare-version-reload');
version.init({
    filename: "version",
    path: "./",
    templateHtmlPath: "./src/index.html",
    templateLinkPath: "../../",
    version: "2.0.0"
});

var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractCSS = new ExtractTextPlugin("styles/[name].css");

var jsPath = "js/";
var data = {
    "dev": { directory: "caiyun" },
    "caiyun": { directory: "caiyun" },
    "masheng": { directory: "masheng" },
    "xiaowo": { directory: "xiaowo" }
};

var config = {
    entry: {
        app: ["./src/app.jsx"],
        vendor: ['react', 'react-dom','react-router', 'react-redux', 'redux', 'antd']
    },
    output: {
        path: path.resolve(__dirname, data[process.env.app].directory),
        // 生成的html 引入 js 的路径
        publicPath: "../",
        filename: jsPath + "[name].js"
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/, 
                exclude: /(node_modules|bower_components)/, 
                loader: "babel",
                // include: [
                //     // 只去解析运行目录下的 src 和 demo 文件夹
                //     path.join(process.cwd(), './src'),
                //     path.join(process.cwd(), './demo')
                // ],
                query: { 
                    presets: ['es2015', 'react'] 
                } 
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg)$/,
                loader: 'file-loader?name=./files/[name].[ext]'
            },
            {
                test: /\.scss$/,
                exclude: /(node_modules|bower_components)/,
                loader: extractCSS.extract('css!sass')
            },
            {
                test: /\.less/,
                loader: extractCSS.extract('css!less')
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: "url-loader?limit=8192&name=./files/[name].[ext]"
            }
        ],
        plugins:['antd',{
            style:'css'
        }]
    },
    sassLoader: {
        includePaths: [path.resolve(__dirname, "src/styles")]
    },
    resolve: {
        //查找依赖的时候的会以此查找这里设置的几个文件名来查找文件
        modulesDirectories: ["node_modules", "src/Config/" + data[process.env.app].directory],
        extensions: ['', '.js', '.jsx', 'css'],
        root: [
            path.resolve(__dirname),
            path.resolve(__dirname, 'src')
        ]
    },
    plugins: [
        // new webpack.DllReferencePlugin({
        //     context: __dirname,
        //     manifest: require('./caiyun/vendor-manifest.json')
        // }),
        new webpack.DefinePlugin({
            __APP__: JSON.stringify(process.env.app),
            "process.env.NODE_ENV": process.env.app == "dev" ? JSON.stringify("development") : JSON.stringify("production")
        }),
        //单独使用link标签加载css并设置路径，相对于output配置中的 publickPath
        extractCSS, 
        new HtmlWebpackPlugin({       
            // 输出的 HTML 文件名
            filename: 'htmls/index.html',
            template: './src/index.html',
            inject: true,
            hash: true
        }),
        new webpack.optimize.CommonsChunkPlugin("vendor", jsPath + "base.js"),
    ]
};
module.exports = config;