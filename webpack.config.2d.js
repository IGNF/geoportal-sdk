/* global module, __dirname */

// -- modules
var fs = require("fs");
var path = require("path");
var webpack = require("webpack");
var header = require("string-template");
var glob = require("glob");
// var spawn = require('cross-spawn');
var shell = require('shelljs');

shell.config.silent = true;

// -- plugins
var DefineWebpackPlugin = webpack.DefinePlugin;
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var BannerWebPackPlugin = webpack.BannerPlugin;
var TerserJsWebPackPlugin = require("terser-webpack-plugin");
var OptimizeCSSAssetsWebPackPlugin = require("optimize-css-assets-webpack-plugin");
var ReplaceWebpackPlugin = require("replace-bundle-webpack-plugin");
var JsDocWebPackPlugin = require("./scripts/webpackPlugins/jsdoc-plugin");
var HandlebarsPlugin = require("./scripts/webpackPlugins/handlebars-plugin");
var HandlebarsLayoutPlugin = require("handlebars-layouts");
var CopyWebpackPlugin = require("copy-webpack-plugin");

// -- performances
var SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
var smp = new SpeedMeasurePlugin();

// -- variables
var pkg = require(path.join(__dirname, "package.json"));

module.exports = (env, argv) => {
    // par defaut
    var devMode = false;
    var logMode = false;
    var suffix = "";
    if (argv.mode === "production") {
        suffix = "";
        logMode = false;
        devMode = false;
    }
    if (argv.mode === "development") {
        suffix = "-map";
        logMode = true;
        devMode = true;
    }
    if (argv.mode === "none") {
        suffix = "-src";
        logMode = true;
        devMode = false;
    }

    return smp.wrap({
        // attention : importance de l'ordre des css pour que la surcharge se fasse correctement
        entry : {
            "GpSDK2D" : [
                "whatwg-fetch",
                path.join(__dirname, "node_modules", "ol", "ol.css"),
                path.join(__dirname, "node_modules", "geoportal-extensions-openlayers", "dist", "GpPluginOpenLayers-src.css"),
                path.join(__dirname, "src", "SDK2D")
            ]
        },
        output : {
            path : path.join(__dirname, "dist", "2d"),
            filename : "GpSDK2D" + suffix + ".js",
            chunkFilename: "[name]" + suffix + ".js",
            library : "Gp",
            libraryTarget : "umd",
            umdNamedDefine : true
        },
        resolve : {
            alias : {
                // - import module es6 :
                // "geoportal-extensions-openlayers",
                // "ol",
                // "ol-mapbox-style",
                // - import bundle :
                // "loglevel",
                // - import forcé en mode bundle :
                "proj4" : path.join(__dirname, "node_modules", "proj4", "dist", "proj4-src.js")
                // - import local :
                // "ol-dist" : path.join(__dirname, "lib", "openlayers", "index.js")
            }
        },
        externals : [
            {
                "node-fetch" : {
                    commonjs2 : "node-fetch",
                    commonjs : "node-fetch",
                    amd : "require"
                },
                xmldom : {
                    commonjs2 : "xmldom",
                    commonjs : "xmldom",
                    amd : "require"
                }
            }
        ],
        devtool : (devMode) ? "eval-source-map" : false,
        // stats : "verbose",
        devServer : {
            // proxy: {
            //      "/samples/resources/proxy/" : {
            //          secure: false,
            //          target: "http://localhost/proxy/proxy.php" // proxy à deployer en local !
            //      }
            // },
            stats : "errors-only",
            // host : "localhost",
            // https: true,
            // port : 9001,
            // hot : true,
            // contentBase : path.join(__dirname),
            // publicPath : "/dist/2d/",
            // openPage : "/samples/index-2d-map.html",
            // open : "google-chrome",
            watchOptions : {
                watch : true,
                poll : true
            },
            overlay : {
                errors : true,
                warnings : false
            }
        },
        optimization : {
            namedModules: true,
            // namedChunks: true,
            // chunkIds: "named",
            /** MINIFICATION */
            minimizer: [
                new TerserJsWebPackPlugin({
                    extractComments: false,
                    terserOptions: {
                        output: {
                            // FIXME qq bug avec les banner !
                            comments: "some",
                            // drop_console: true
                        },
                        mangle: true
                    }
                }),
                new OptimizeCSSAssetsWebPackPlugin({})
            ],
            splitChunks : {
                cacheGroups : {
                    /** EXTRACT CSS INTO SINGLE FILE */
                    styles : {
                        name : "GpSDK2D",
                        test : /\.css$/,
                        chunks : "all",
                        enforce : true
                    },
                    /** CHUNK FOR GEOTIFF */
                    vendor : {
                        name: 'chunk-geotiff',
                        test: /node_modules/,
                        reuseExistingChunk: true
                    }
                }
            }
        },
        module : {
            rules : [
                {
                    // test : (value) => {
                    //     if (/\.js$/.test(value)) {
                    //         console.log("#### IN : ", value);
                    //         return value;
                    //     }
                    //     console.log("#### OUT : ", value);
                    // },
                    test : /\.js$/,
                    include : [
                        path.join(__dirname, "src"),
                        /node_modules\/geoportal-extensions-openlayers\//,
                        /node_modules\/geoportal-access-lib\//,
                        // /node_modules\/eventbusjs\//,
                        // /node_modules\/loglevel\//,
                        // /node_modules\/ol\//,
                        // cf. https://github.com/openlayers/ol-mapbox-style/issues/246
                        // /node_modules\/@mapbox\/mapbox-gl-style-spec\//, <!-- exceptions !? -->
                        /node_modules\/@mapbox\/mapbox-gl-style-spec\/deref.js/,
                        /node_modules\/ol-mapbox-style\//,
                    ],
                    // exclude : [/node_modules/],
                    use : {
                        loader : "babel-loader",
                        options : {
                            plugins : ["@babel/plugin-transform-template-literals"],
                            compact : false,
                            presets : [
                                [
                                    "@babel/preset-env", {
                                        // "useBuiltIns": "usage",
                                        // "corejs": { version: '3.6', proposals: false },
                                        // "debug": true,
                                        // "loose": true,
                                        // "exclude": ['transform-typeof-symbol'],
                                        // "targets": {
                                        //     "ie" : "10"
                                        // }
                                    }
                                ]
                            ]
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
                        path.join(__dirname, "lib"),
                        path.join(__dirname, "src", "Map.js"),
                        path.resolve(__dirname, "src", "OpenLayers", "CSS")
                    ],
                    use : [{
                        loader : "eslint-loader",
                        options : {
                            emitWarning : true
                        }
                    }]
                },
                {
                    /** proj4 est exposé en global : proj4 ! */
                    test : require.resolve("proj4"),
                    use : [{
                        loader : "expose-loader",
                        options : "proj4"
                    }]
                },
                {
                    /** openlayers est exposé en global : ol ! */
                    // test : path.join(__dirname, "lib", "openlayers", "index.js"),
                    test : /src\/Utils\/dist-openlayers\/index.js$/,
                    use : [{
                        loader : "expose-loader",
                        options : "ol"
                    }]
                },
                {
                    test : /\.css$/,
                    // exclude : [/node_modules/],
                    include : [
                        path.join(__dirname, "node_modules", "ol"),
                        path.join(__dirname, "node_modules", "geoportal-extensions-openlayers"),
                        path.join(__dirname, "src", "OpenLayers", "CSS")
                    ],
                    use : [
                        MiniCssExtractPlugin.loader,
                        "css-loader"
                    ]
                },
                {
                    test : /\.(png|jpg|gif|svg)$/,
                    loader : "url-loader",
                    options: {
                        fallback : "responsive-loader",
                        quality : 100
                    },
                    // exclude : [/node_modules/],
                    include : [
                        path.join(__dirname, "node_modules", "geoportal-extensions-openlayers")
                    ]
                }
            ]
        },
        plugins : [
            /** REPLACEMENT DE VALEURS */
            new ReplaceWebpackPlugin(
                [
                    {
                        partten : /__DATE__/g,
                        /** replacement de la clef __DATE__ par la date du build */
                        replacement : function () {
                            return pkg.date;
                        }
                    },
                    {
                        partten : /__PRODUCTION__/g,
                        replacement : function () {
                            /** replacement de la clef __PRODUCTION__ pour le LOGGER */
                            return !logMode;
                        }
                    },
                    {
                        partten : /__SWITCH2D3D_ALLOWED__/g,
                        replacement : function () {
                            return false;
                        }
                    }
                ]
            ),
            /** GESTION DU LOGGER */
            // new DefineWebpackPlugin({
            //     __PRODUCTION__ : JSON.stringify(!logMode),
            //     __SWITCH2D3D_ALLOWED__ : JSON.stringify(false)
            // }),
            /** GENERATION DE LA JSDOC */
            new JsDocWebPackPlugin({
                conf : path.join(__dirname, "doc/jsdoc.json")
            }),
            /** CSS / IMAGES */
            new MiniCssExtractPlugin({
                filename : "GpSDK2D" + suffix + ".css"
            }),
            /* COPIE DES RESSOURCES IMAGES JSDOC */
            new CopyWebpackPlugin([
                {
                    from : path.join(__dirname, "doc", "images", "**/*"),
                    to : path.join(__dirname, "jsdoc", "images"),
                    context : path.join(__dirname, "doc", "images")
                }
            ]),
            /** HANDLEBARS TEMPLATES */
            new HandlebarsPlugin(
                {
                    entry : {
                        path : path.join(__dirname, "samples-src", "pages", "2d"),
                        pattern : "**/*-bundle.html"
                    },
                    output : {
                        path : path.join(__dirname, "samples", "2d"),
                        flatten : false,
                        filename : "[name]" + suffix + ".html"
                    },
                    helpers : [
                        HandlebarsLayoutPlugin
                    ],
                    partials : [
                        path.join(__dirname, "samples-src", "templates", "2d", "*.hbs"),
                        path.join(__dirname, "samples-src", "templates", "partials", "*.hbs"),
                        path.join(__dirname, "samples-src", "templates", "partials", "2d", "*.hbs")
                    ],
                    context : [
                        path.join(__dirname, "samples-src", "config-2d.json"),
                        {
                            mode : suffix
                        }
                    ]
                }
            ),
            /** TEMPLATES INDEX */
            new HandlebarsPlugin(
                {
                    entry : path.join(__dirname, "samples-src", "pages", "index-2d.html"),
                    output : {
                        path : path.join(__dirname, "samples"),
                        filename : "[name]" + suffix + ".html"
                    },
                    context : {
                        samples : () => {
                            var root = path.join(__dirname, "samples-src", "pages", "2d");
                            var list = glob.sync(path.join(root, "**", "*-bundle.html"));
                            list = list.map(function (filePath) {
                                var relativePath = path.relative(root, filePath);
                                var label = relativePath.replace("/", " -- ");
                                var pathObj = path.parse(relativePath);
                                return {
                                    filePath : path.join("2d", pathObj.dir, pathObj.name.concat(suffix).concat(pathObj.ext)),
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
        /** AJOUT DES LICENCES */
        .concat([
            new BannerWebPackPlugin({
                banner : header(fs.readFileSync(path.join(__dirname, "licences", "licence-proj4js.tmpl"), "utf8"), {
                    __VERSION__ : pkg.devDependencies["proj4"],
                }),
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
                banner : header(fs.readFileSync(path.join(__dirname, "licences", "licence-openlayers.tmpl"), "utf8"), {
                    __VERSION__ : pkg.devDependencies["ol"],
                }),
                raw : true
            }),
            new BannerWebPackPlugin({
                banner : header(fs.readFileSync(path.join(__dirname, "licences", "licence-olms.tmpl"), "utf8"), {
                    __VERSION__ : pkg.devDependencies["ol-mapbox-style"],
                }),
                raw : true
            }),
            new BannerWebPackPlugin({
                banner : header(fs.readFileSync(path.join(__dirname, "licences", "licence-geoportal-extensions.tmpl"), "utf8"), {
                    __NAME__ : "geoportal-extensions-openlayers",
                    __VERSION__ : pkg.devDependencies["geoportal-extensions-openlayers"],
                }),
                raw : true
            }),
            new BannerWebPackPlugin({
                banner : header(fs.readFileSync(path.join(__dirname, "licences", "licence-ign.tmpl"), "utf8"), {
                    __BRIEF__ : pkg.description,
                    __VERSION__ : pkg.SDK2DVersion,
                    __DATE__ : pkg.date,
                    __BUILD_DATE__ : new Date().toLocaleString("fr-FR", { timeZone: 'UTC' }),
                    __GIT_BRANCH__ : shell.exec('git name-rev --name-only HEAD').stdout.trim(),
                    __GIT_COMMIT__ : shell.exec('git rev-parse --short HEAD').stdout.trim(),
                    __GIT_STATUS__ : shell.exec('git status -s -uall').stdout.trim().length > 0
                }),
                raw : true,
                entryOnly : true
            })
        ])
    });
};
