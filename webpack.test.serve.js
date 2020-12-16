/* global module, __dirname, process */
var path = require("path");
var webpack = require("webpack");

// plugin
var HtmlWebpackPlugin = require("html-webpack-plugin");
var DefineWebpackPlugin = webpack.DefinePlugin;
var MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry : {
        tests : path.join(__dirname, "test")
    },
    output : {
        path : path.join(__dirname),
        filename : "[name].js",
        libraryTarget : "umd"
    },
    resolve : {
        alias : {
            "itowns" : path.join(__dirname, "node_modules", "itowns", "lib", "MainBundle.js")
        }
    },
    externals : ["request", "xmldom"],
    devtool : "eval-source-map",
    devServer : {
        stats : "errors-only",
        host : "localhost",
        port : 9001,
        hot : true,
        open : "google-chrome",
        watchOptions : {
            watch : true,
            poll : true
        },
        overlay : {
            errors : true,
            warnings : false
        }
    },
    module: {
        rules : [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test : /\.(png|jpg|gif|svg)$/,
                loader : "url-loader",
                options: {
                    fallback : "responsive-loader",
                    quality : 100
                }
            }
        ]
    },
    plugins : [
        // on veut les logs !
        new DefineWebpackPlugin({
            __PRODUCTION__ : JSON.stringify(false),
            __SWITCH2D3D_ALLOWED__ : JSON.stringify(true)
        }),
        new HtmlWebpackPlugin({
            title : "Mocha Tests Units",
            filename : "index.html",
            template : require.resolve(
                "html-webpack-plugin/default_index.ejs"
            )
        })
    ]
};
