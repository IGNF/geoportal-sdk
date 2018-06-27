/* global module, __dirname, process */
var path = require("path");
var webpack = require("webpack");

// plugin
var HtmlWebpackPlugin = require("html-webpack-plugin");
var DefineWebpackPlugin = webpack.DefinePlugin;
var ExtractTextWebPackPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry : {
        tests : path.join(__dirname)
    },
    output : {
        path : path.join(__dirname),
        filename : "[name].js",
        libraryTarget : "umd"
    },
    resolve : {
        alias : {
            gp : path.resolve(__dirname, "..", "node_modules", "geoportal-extensions-openlayers-itowns", "dist", "GpPluginOlItowns-src.js"),
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
            // pour extraire les css
            {
                test : /\.css$/,
                include : path.resolve(__dirname, "..", "res"),
                use : ExtractTextWebPackPlugin.extract({
                    fallback : {
                        loader : "style-loader"
                    },
                    use : {
                        loader : "css-loader"
                    }
                })
            },
            {
                test : /\.(png|jpg|gif|svg)$/,
                loader : "url-loader",
                exclude : /node_modules/
            }
        ]
    },
    plugins : [
        // on veut les logs !
        new DefineWebpackPlugin({
            __PRODUCTION__ : JSON.stringify(false)
        }),
        new HtmlWebpackPlugin({
            title : "Mocha Tests Units",
            filename : "index.html",
            template : require.resolve(
                "html-webpack-plugin/default_index.ejs"
            )
        }),
        // pour extraire les css (suite)
        new ExtractTextWebPackPlugin("[name]")
    ]
};
