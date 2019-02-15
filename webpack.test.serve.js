/* global module, __dirname, process */
var path = require("path");
var webpack = require("webpack");

// plugin
var HtmlWebpackPlugin = require("html-webpack-plugin");
var DefineWebpackPlugin = webpack.DefinePlugin;
var ExtractTextWebPackPlugin = require("extract-text-webpack-plugin");

var dependencies = "lib"; // node_modules en mode production !

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
            "geoportal-extensions-openlayers" : path.resolve(__dirname, dependencies, "geoportal-extensions-openlayers", "dist", "GpPluginOpenLayers-src.js"),
            "geoportal-extensions-itowns" : path.resolve(__dirname, dependencies, "geoportal-extensions-itowns", "dist", "GpPluginItowns-src.js"),
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
                include : path.resolve(__dirname, "res"),
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
            __PRODUCTION__ : JSON.stringify(false),
            __SWITCH2D3D_ALLOWED__ : JSON.stringify(true)
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
