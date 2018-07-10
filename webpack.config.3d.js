/* global module, __dirname */

// -- modules
var fs = require("fs");
var path = require("path");
var webpack = require("webpack");
var header = require("string-template");
var glob = require("glob");

// -- plugins
var DefineWebpackPlugin = webpack.DefinePlugin;
var ExtractTextWebPackPlugin = require("extract-text-webpack-plugin");
var BannerWebPackPlugin = webpack.BannerPlugin;
var UglifyJsWebPackPlugin = webpack.optimize.UglifyJsPlugin;
var ReplaceWebpackPlugin = require("replace-bundle-webpack-plugin");
var JsDocWebPackPlugin = require("jsdoc-webpack-plugin");
var HandlebarsPlugin = require("./scripts/webpackPlugins/handlebars-plugin");
var HandlebarsLayoutPlugin = require("handlebars-layouts");
var CopyWebpackPlugin = require("copy-webpack-plugin");

// -- performances
var SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
var smp = new SpeedMeasurePlugin();

// -- variables
var date = new Date().toISOString().split("T")[0];
var pkg = require(path.join(__dirname, "package.json"));

module.exports = env => {
    // environnement d'execution
    var production = (env) ? env.production : false;
    var development = (env) ? env.development : false;

    var _mode = (production) ? "" : (development) ? "-map" : "-src";

    return smp.wrap({
        // attention : importance de l'ordre des css pour que la surcharge se fasse correctement
        entry : [
            path.join(__dirname, "node_modules", "openlayers", "dist", (production) ? "ol.css" : "ol-debug.css"),
            path.join(__dirname, "node_modules", "geoportal-extensions-openlayers-itowns", "dist", (production) ? "GpPluginOlItowns.css" : "GpPluginOlItowns-src.css" ),
            path.join(__dirname, "src", "SDK3D")
        ],
        output : {
            path : path.join(__dirname, "dist", "3d"),
            filename : "GpSDK3D" + _mode + ".js",
            library : "Gp",
            libraryTarget : "umd",
            umdNamedDefine : true
        },
        resolve : {
            alias : {
                gp : path.resolve(__dirname, "node_modules", "geoportal-extensions-openlayers-itowns", "dist", (production) ? "GpPluginOlItowns.js" : "GpPluginOlItowns-src.js"),
                itowns : path.resolve(__dirname, "lib", "Itowns", "init-itowns.js")
            }
        },
        externals : {
            request : {
                commonjs2 : "request",
                commonjs : "request",
                amd : "require"
            },
            xmldom : {
                commonjs2 : "xmldom",
                commonjs : "xmldom",
                amd : "require"
            }
        },
        devtool : (development) ? "eval-source-map" : false,
        module : {
            rules : [
                {
                    test : /\.js$/,
                    exclude : /node_modules/,
                    use : {
                        loader : "babel-loader",
                        options : {
                            presets : ["env"]
                        }
                    }
                },
                {
                    test : /\.js$/,
                    enforce : "pre",
                    include : [
                        path.join(__dirname, "src")
                    ],
                    exclude : [
                        /node_modules/,
                        path.resolve(__dirname, "src", "Map.js"),
                    ],
                    use : [
                        {
                            loader : "eslint-loader",
                            options : {
                                emitWarning : true
                            }
                        }
                    ]
                },
                {
                    test : require.resolve("openlayers"),
                    use : [{
                        loader : "expose-loader",
                        options : "ol"
                    }]
                },
                // {
                //     test : path.resolve(__dirname, "lib", "Itowns", "init-itowns.js"),
                //     use : [{
                //         loader : "expose-loader",
                //         options : "itowns"
                //     }]
                // },
                {
                    test : /\.css$/,
                    include : [
                        path.join(__dirname, "node_modules", "geoportal-extensions-openlayers-itowns", "dist"),
                        path.join(__dirname, "node_modules", "openlayers", "dist"),
                        path.join(__dirname, "res", "Itowns"),
                        path.join(__dirname, "res", "OpenLayers")
                    ],
                    use : ExtractTextWebPackPlugin.extract({
                        fallback : {
                            loader : "style-loader",
                            options : {
                                sourceMap : false
                            }
                        },
                        use : {
                            loader : "css-loader",
                            options : {
                                sourceMap : true, // FIXME ?
                                minimize : (production) ? true : false
                            }
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
            /** REPLACEMENT DE VALEURS */
            new ReplaceWebpackPlugin(
                [
                    {
                        partten : /__GPSDKVERSION__/g,
                        /** replacement de la clef __GPVERSION__ par la version du package */
                        replacement : function () {
                            return pkg.SDK3DVersion;
                        }
                    },
                    {
                        partten : /__GPDATE__/g,
                        /** replacement de la clef __GPDATE__ par la date du build */
                        replacement : function () {
                            return date;
                        }
                    }
                ]
            ),
            /** GESTION DU LOGGER */
            new DefineWebpackPlugin({
                __PRODUCTION__ : JSON.stringify(production),
                __SWITCH2D3D_ALLOWED__ : JSON.stringify(true)
            }),
            /** GENERATION DE LA JSDOC */
            new JsDocWebPackPlugin({
                conf : path.join(__dirname, "doc/jsdoc.json")
            }),
            /** CSS / IMAGES */
            new ExtractTextWebPackPlugin("GpSDK3D" + _mode + ".css"),
            /** HANDLEBARS TEMPLATES */
            new HandlebarsPlugin(
                {
                    entry : {
                        path : path.join(__dirname, "samples-src", "pages", "3d"),
                        pattern : "**/*.html"
                    },
                    output : {
                        path : path.join(__dirname, "samples", "3d"),
                        flatten : false,
                        filename : "[name]" + _mode + ".html"
                    },
                    helpers : [
                        HandlebarsLayoutPlugin
                    ],
                    partials : [
                        path.join(__dirname, "samples-src", "templates", "3d", "*.hbs"),
                        path.join(__dirname, "samples-src", "templates", "partials", "*.hbs"),
                        path.join(__dirname, "samples-src", "templates", "partials", "3d", "*.hbs")
                    ],
                    context : [
                        path.join(__dirname, "samples-src", "config-3d.json"),
                        {
                            mode : _mode
                        }
                    ]
                }
            ),
            /** TEMPLATES INDEX */
            new HandlebarsPlugin(
                {
                    entry : path.join(__dirname, "samples-src", "pages", "index-3d.html"),
                    output : {
                        path : path.join(__dirname, "samples"),
                        filename : "[name]" + _mode + ".html"
                    },
                    context : {
                        samples : () => {
                            var root = path.join(__dirname, "samples-src", "pages", "3d");
                            var list = glob.sync(path.join(root, "**", "*.html"));
                            list = list.map(function (filePath) {
                                var relativePath = path.relative(root, filePath);
                                var label = relativePath.replace("/", " -- ");
                                var pathObj = path.parse(relativePath);
                                return {
                                    filePath : path.join("3d", pathObj.dir, pathObj.name.concat(_mode).concat(pathObj.ext)),
                                    label : label
                                };
                            });
                            return list;
                        }
                    }
                }
            ),
            /* RESOURCES COPY FOR SAMPLES */
            new CopyWebpackPlugin([
                {
                    from : path.join(__dirname, "samples-src", "resources", "**/*"),
                    to : path.join(__dirname, "samples", "resources"),
                    context : path.join(__dirname, "samples-src", "resources")
                }
            ])
        ]
        /** MINIFICATION */
        .concat(
            (production) ? [
                new UglifyJsWebPackPlugin({
                    output : {
                        comments : false,
                        beautify : false
                    },
                    uglifyOptions : {
                        mangle : true,
                        warnings : false,
                        compress : false
                    }
                })] : []
        )
        /** AJOUT DES LICENCES */
        .concat([
            new BannerWebPackPlugin({
                banner : fs.readFileSync(path.join(__dirname, "licences", "licence-proj4js.txt"), "utf8"),
                raw : true
            }),
            new BannerWebPackPlugin({
                banner : fs.readFileSync(path.join(__dirname, "licences", "licence-es6promise.txt"), "utf8"),
                raw : true
            }),
            new BannerWebPackPlugin({
                banner : fs.readFileSync(path.join(__dirname, "licences", "licence-sortable.txt"), "utf8"),
                raw : true
            }),
            new BannerWebPackPlugin({
                banner : fs.readFileSync(path.join(__dirname, "licences", "licence-openlayers.txt"), "utf8"),
                raw : true
            }),
            new BannerWebPackPlugin({
                banner : fs.readFileSync(path.join(__dirname, "licences", "licence-itowns.txt"), "utf8"),
                raw : true
            }),
            new BannerWebPackPlugin({
                banner : header(fs.readFileSync(path.join(__dirname, "licences", "licence-ign.tmpl"), "utf8"), {
                    __BRIEF__ : pkg.description,
                    __VERSION__ : pkg.SDK3DVersion,
                    __DATE__ : date
                }),
                raw : true,
                entryOnly : true
            })
        ])
    });
};
