/* global module, __dirname */

// -- modules
var fs = require("fs");
var path = require("path");
var webpack = require("webpack");
var header = require("string-template");
var glob = require("glob");

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
            "GpSDK3D" : [
                path.join(__dirname, "node_modules", "ol", "ol.css"),
                path.join(__dirname, "node_modules", "geoportal-extensions-openlayers", "dist", "GpPluginOpenLayers-src.css" ),
                path.join(__dirname, "node_modules", "geoportal-extensions-itowns", "dist", "GpPluginItowns-src.css" ),
                path.join(__dirname, "src", "SDK3D")
            ]
        },
        output : {
            path : path.join(__dirname, "dist", "3d"),
            filename : "GpSDK3D" + suffix + ".js",
            library : "Gp",
            libraryTarget : "umd",
            umdNamedDefine : true
        },
        resolve : {
            alias : {
                // - import module es6 :
                // "geoportal-extensions-openlayers",
                // "geoportal-extensions-itowns",
                // "ol",
                // "ol-mapbox-style",
                // - import bundle :
                // "loglevel",
                // - import forcé en mode bundle :
                "proj4" : path.join(__dirname, "node_modules", "proj4", "dist", "proj4-src.js"),
                "itowns" : path.join(__dirname, "node_modules", "itowns", "dist", "itowns.js"),
                // - import local :
                // "ol-dist" : path.join(__dirname, "lib", "openlayers", "index.js")
            }
        },
        externals : [
            {
                // INFO : itowns est maintenant disponible en interne.
                // Son chargement differé est optionnel.

                // itowns : {
                //     commonjs2 : "itowns",
                //     commonjs : "itowns",
                //     amd : "itowns",
                //     root : "itowns"
                // },
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
            }
        ],
        devtool : (devMode) ? "eval-source-map" : false,
        stats : "verbose",
        optimization : {
            /** MINIFICATION */
            minimizer: [
                new TerserJsWebPackPlugin({
                    terserOptions: {
                        output: {
                            // FIXME qq bug avec les banner !
                            comments: "some",
                            // drop_console: true
                        },
                        mangle: true // mettre à false pour le debug !
                    }
                }),
                new OptimizeCSSAssetsWebPackPlugin({})
            ],
            /** EXTRACT CSS INTO SINGLE FILE */
            splitChunks : {
                cacheGroups : {
                    styles : {
                        name : "GpSDK3D",
                        test : /\.css$/,
                        chunks : "all",
                        enforce : true
                    }
                }
            }
        },
        module : {
            rules : [
                {
                    test : /\.js$/,
                    include : [
                        path.join(__dirname, "src"),
                        /node_modules\/geoportal-extensions-openlayers\//,
                        /node_modules\/geoportal-extensions-itowns\//,
                        /node_modules\/geoportal-access-lib\//,
                        // /node_modules\/loglevel\//,
                        // /node_modules\/ol\//,
                        // /node_modules\/ol-mapbox-style\//,
                        // /node_modules\/@mapbox\/mapbox-gl-style-spec\//,
                        // /node_modules\/itowns\//,
                        // /node_modules\/three\//,
                        // /node_modules\/proj4\//,
                        /node_modules\/@mapbox\/mapbox-gl-style-spec\/deref.js/,
                        /node_modules\/ol-mapbox-style\//,
                    ],
                    // exclude : [/node_modules/],
                    use : {
                        loader : "babel-loader",
                        options : {
                            // plugins : [["@babel/plugin-transform-runtime", { corejs: 3 }]],
                            compact : false,
                            presets : [
                                [
                                    "@babel/preset-env", {
                                        "useBuiltIns": "usage",
                                        "corejs": { version: '3.6', proposals: true },
                                        "debug":true,
                                        "targets": {
                                            // "ie" : "10"
                                        }
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
                    /** olms est exposé en global : olms ! */
                    test : require.resolve("ol-mapbox-style"),
                    // test : /node_modules\/ol-mapbox-style\/index\.js$/,
                    // include : [
                    //     /node_modules\/ol\//,
                    //     /node_modules\/ol-mapbox-style\//,
                    //     // /node_modules\/(?!(ol|@mapbox\/mapbox-gl-style-spec)\/)/,
                    //     /node_modules\/@mapbox\/mapbox-gl-style-spec\//
                    // ],
                    use : [
                        {
                            loader : "expose-loader",
                            options : "olms"
                        },
                        {
                            loader : "babel-loader",
                            options : {
                                // plugins : [["@babel/plugin-transform-runtime", { corejs: 3 }]],
                                presets : [
                                    [
                                        "@babel/preset-env", {
                                            "useBuiltIns": "usage",
                                            "corejs": { version: '3.6', proposals: true },
                                            "debug":true,
                                            "targets": {
                                                // "ie" : "10"
                                            }
                                        }
                                    ]
                                ]
                            }
                        }
                    ]
                },
                {
                    /** itowns est exposé en global : itowns ! */
                    // test : require.resolve("itowns"),
                    test : /node_modules\/itowns\/dist\/itowns.js/,
                    use : [{
                        loader : "expose-loader",
                        options : "itowns"
                    },
                    // {
                    //     loader : "babel-loader",
                    //     options : {
                    //         // plugins : [["@babel/plugin-transform-runtime", { corejs: 3 }]],
                    //         compact : true,
                    //         presets : [
                    //             [
                    //                 "@babel/preset-env", {
                    //                     "useBuiltIns": "usage",
                    //                     "corejs": { version: '3.6', proposals: true },
                    //                     "debug":true,
                    //                     "targets": {
                    //                         // "ie" : "10"
                    //                     }
                    //                 }
                    //             ]
                    //         ]
                    //     }
                    // }
                ]
                },
                {
                    test : /\.css$/,
                    // exclude : [/node_modules/],
                    include : [
                        path.join(__dirname, "node_modules", "geoportal-extensions-openlayers"),
                        path.join(__dirname, "node_modules", "geoportal-extensions-itowns"),
                        path.join(__dirname, "node_modules", "ol"),
                        path.join(__dirname, "src", "Itowns", "CSS"),
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
                        path.join(__dirname, "node_modules", "geoportal-extensions-openlayers"),
                        path.join(__dirname, "node_modules", "geoportal-extensions-itowns"),
                        path.join(__dirname, "src", "Itowns", "CSS"),
                        path.join(__dirname, "src", "OpenLayers", "CSS")
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
                        partten : /__VERSION_ITOWNS__/g,
                        /** replacement de la clef __VERSION_ITOWNS__ par la version 3d d'itowns */
                        replacement : function () {
                            return pkg.dependencies["itowns"];
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
                            return true;
                        }
                    }
                ]
            ),
            /** GESTION DU LOGGER */
            // new DefineWebpackPlugin({
            //     __PRODUCTION__ : JSON.stringify(!logMode),
            //     __SWITCH2D3D_ALLOWED__ : JSON.stringify(true)
            // }),
            /** GENERATION DE LA JSDOC */
            new JsDocWebPackPlugin({
                conf : path.join(__dirname, "doc/jsdoc.json")
            }),
            /** CSS / IMAGES */
            new MiniCssExtractPlugin({
                filename : "GpSDK3D" + suffix + ".css"
            }),
            /** HANDLEBARS TEMPLATES */
            new HandlebarsPlugin(
                {
                    entry : {
                        path : path.join(__dirname, "samples-src", "pages", "3d"),
                        pattern : "**/*-bundle.html"
                    },
                    output : {
                        path : path.join(__dirname, "samples", "3d"),
                        flatten : false,
                        filename : "[name]" + suffix + ".html"
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
                            mode : suffix
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
                        filename : "[name]" + suffix + ".html"
                    },
                    context : {
                        samples : () => {
                            var root = path.join(__dirname, "samples-src", "pages", "3d");
                            var list = glob.sync(path.join(root, "**", "*-bundle.html"));
                            list = list.map(function (filePath) {
                                var relativePath = path.relative(root, filePath);
                                var label = relativePath.replace("/", " -- ");
                                var pathObj = path.parse(relativePath);
                                return {
                                    filePath : path.join("3d", pathObj.dir, pathObj.name.concat(suffix).concat(pathObj.ext)),
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
                },
                /* COPY ITOWNS LIBRARY IN DIST DIR */
                {
                    from : path.join(__dirname, "node_modules", "itowns", "dist", "itowns.js"),
                    to : path.join(__dirname, "dist", "3d")
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
                banner : header(fs.readFileSync(path.join(__dirname, "licences", "licence-itowns.tmpl"), "utf8"), {
                    __VERSION__ : pkg.devDependencies["itowns"],
                }),
                raw : true
            }),
            new BannerWebPackPlugin({
                banner : header(fs.readFileSync(path.join(__dirname, "licences", "licence-geoportal-extensions.tmpl"), "utf8"), {
                    __NAME__ : "geoportal-extensions-itowns",
                    __VERSION__ : pkg.devDependencies["geoportal-extensions-itowns"],
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
                    __VERSION__ : pkg.SDK3DVersion,
                    __DATE__ : pkg.date
                }),
                raw : true,
                entryOnly : true
            })
        ])
    });
};
