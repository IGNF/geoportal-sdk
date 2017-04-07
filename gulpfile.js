/* global process */

(function (gulp, gulpLoadPlugins) {
    'use strict';

    // gestion des paths
    var path  = require("path");

    // load plugins
    var $ = gulpLoadPlugins({pattern: '*', lazy: true});

    // tests mocha
    $.mochaPhantomJS = require('gulp-mocha-phantomjs');

    var _ = {
        root:   $.shelljs.pwd(),
        res:    './res',
        src:    './src',
        lib:    './lib',
        test:   './test',
        doc:    './doc',
        sample: './samples',
        dist:   './dist',
        utils:  './utils'
    };

    var build = {
        src   : 'target/src',
        lib   : 'target/lib',
        test  : 'target/test',
        doc   : 'target/doc',
        sample: 'target/samples',
        js    : 'target/js',
        umd   : 'target/umd',
        dist  : 'target/dist'
    };

    //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //| ✓ Options
    //| > usage : gulp [task]
    //| > usage : gulp [task] --ol3 | --vg | --mix (ol3 by default)
    //| > usage : gulp [task] --production
    //| > usage : gulp [task] --debug
    //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var opts = require('minimist')(process.argv.slice(2));

    // options
    var isOl3  = opts.ol3;
    var isVG   = opts.vg;
    var isMix  = opts.mix;

    var isProduction = opts.production;
    var isDebug = opts.debug;

    // execution par defaut
    if (!isOl3 && !isVG && !isMix) {
        isOl3 = true; // par defaut !
    }

    // build dist directory
    var getDistDirName = function () {
        var dirName = (isOl3) ? 'ol3' : (isVG) ? 'virtual' : (isMix) ? 'mix' : null;
        return dirName;
    };

    // bundle
    var getBaseFileName = function () {
        var baseFileName = (isOl3) ? 'GpOl3' : (isVG) ? 'GpVG' : (isMix) ? 'GpOL3VG' : null;
        return baseFileName;
    };

    var getDistFileName = function () {
        var distFileName = (isProduction ? getBaseFileName() + '.js' : getBaseFileName() + '-src.js') ;
        return distFileName;
    };

    var getDistFileNameDebug = function () {
        var distFileNameDebug = getBaseFileName() + '-debug.js';
        return distFileNameDebug;
    };

    // date auto
    var npmConf = require("./package.json") ;
    var buildDate = new Date().toISOString().split("T")[0];

    //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //| ✓ jsonlint
    //| > Validation JSON (fichiers de configuration)
    //| > http://jsonlint.com/
    //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    gulp.task('jsonlint', function () {

        return gulp.src([
            'package.json',
            'jsdoc.json',
            '.jshintrc',
            '.jscsrc'
        ])
            .pipe($.plumber())
            .pipe($.jsonminify())
            .pipe($.jsonlint())
            .pipe($.jsonlint.reporter());
    });

    //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //| ✓ jshint
    //| > Helps to detect errors and potential problems in code.
    //| > http://jscs.info/rules.html
    //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    gulp.task('jshint', function () {

        return gulp.src([ path.join(_.src, '**/*.js') ])
            .pipe($.plumber())
            .pipe($.jshint('.jshintrc'))
            .pipe($.jshint.reporter('default'));
    });

    // |**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // | ✓ jscs
    // | > Coding conventions respect
    // | > http://jscs.info/rules.html
    // '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    gulp.task("jscs", function () {

        var jscs = require("gulp-jscs");

        return gulp.src([ path.join(_.src, "**/*.js") ])
            .pipe($.plumber())
            .pipe(jscs())
            .pipe(jscs.reporter());
    });

    //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //| ✓ jsdoc
    //| > Documenting JavaScript with JSDoc.
    //| > http://usejsdoc.org
    //| > cf. TODO
    //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    gulp.task('jsdoc', function () {

        // TODO
        // find a plugin to do this !
        // cf. https://www.npmjs.com/package/gulp-jsdoc
        // cf. https://www.npmjs.com/package/gulp-jsdoc3

        $.shelljs.exec('./node_modules/.bin/jsdoc -c jsdoc.json');

    });

    //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //| ✓ mocha with phantomJS
    //| > JavaScript test framework running on node.js and the browser
    //| > http://mochajs.org/
    //| > https://www.npmjs.com/package/gulp-mocha-phantomjs
    //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    gulp.task('mocha-phantomjs', function () {

        // pour information,
        // la ligne de commande est la suivante :
        // $.shelljs.exec('./node_modules/.bin/mocha --recursive -R list ./test/spec/');

        return gulp.src(path.join(_.test, 'index.html'))
            .pipe($.mochaPhantomJS({reporter: 'spec'}));
    });

    //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //| ✓ requirejs avec optimisation avec amdclean
    //| > Framework RequireJS
    //| > https://github.com/gfranko/amdclean
    //| > principe -> http://requirejs.org/docs/optimization.html
    //| > options  -> https://github.com/jrburke/r.js/blob/master/build/example.build.js
    //| > astuces  -> http://stackoverflow.com/questions/23978361/using-gulp-to-build-requirejs-project-gulp-requirejs
    //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    gulp.task('requirejs-amdclean', function (taskReady) {

        var requirejs = require('requirejs');

        // Pour information,
        // les valeurs possibles sont les suivantes :
        // uglify, uglify2, closure, or closure.keepLines
        var mode = 'none';
        if (isProduction) {
            $.util.log("OK, mode optimisation...");
            mode = 'uglify2';
        }

        // module global en fonction du bundle
        var _globalModules = [];

        // classes à charger en fonction du bundle
        var _includes = [];

        // lib. externes à charger en fonction du bundle
        var _deps = {
            log4js : (isDebug) ? "../lib/external/woodman/woodman-amd" : "../lib/external/empty"
        };

        var pluginsDir;
        // param bundle ol3
        if (isOl3) {
            pluginsDir = "../lib/external/geoportail/plugins-ol3/";
            _deps.ol =  "../lib/external/ol3/ol";
            _deps["gp"] = pluginsDir + "GpPluginOl3-src";
            _includes.push("ol3/OL3");
            _globalModules.push('ol');
        }

        // param bundle vg
        else if (isVG) {
             pluginsDir = "../lib/external/geoportail/plugins-vg/";
             _deps.vg = "../lib/external/virtual/js/VirtualGeoWeb-5.0.11";
            _deps["gp"] = pluginsDir + "GpPluginVg-src";
             _includes.push("virtual/VG");
             // VirtualGeo est déjà déclaré globale :
             //     _globalModules.push('VirtualGeo');
        }

        else if (isMix) {
            _deps.ol = "../lib/external/ol3/ol";
            _deps.vg = "../lib/external/virtual/js/VirtualGeoWeb-5.0.11";
            pluginsDir = "../lib/external/geoportail/plugins-mix/";
            _deps["gp"] = pluginsDir + "GpPluginOl3Vg-src";
            _includes.push("virtual/VG");
            _includes.push("ol3/OL3");
            _globalModules.push('ol');

        } else {
            // TODO ...
        }

        // on ajoute le point d'entrée du programme
        _includes.push("AHN");

        requirejs.optimize({
            mainConfigFile: path.join(build.src,  'Config.js'),
            paths: _deps,
            baseUrl: build.src,
            optimize: mode,
            uglify2: {
                output: {
                    beautify: false
                },
                warnings: false,
                mangle: (isProduction) ? true : false
            },
            include: _includes,
            out: path.join(build.js, (isDebug ? getDistFileNameDebug() : getDistFileName())),
            findNestedDependencies: false,
            preserveLicenseComments: false,
            useStrict: true,
            onBuildRead: function (moduleName, path, contents) {

                if (!isDebug) {
                    var groundskeeper = require('groundskeeper');
                    var cleaner = groundskeeper({
                        console: true,                          // Keep console logs
                        debugger: false,                        // Keep debugger; statements
                        pragmas: ['development'],               // Keep pragmas with the following identifiers
                        namespace: [
                            'this.logger',
                            'self.logger',
                            'logger'
                       ] // Besides console also remove function calls in the given namespace,
                    });
                    cleaner.write(contents);
                    return cleaner.toString();
                }
                return contents;
            },
            onModuleBundleComplete: function (data) {

                var fs = require('fs'),
                         amdclean = require('amdclean'),
                         outputFile = data.path;

                fs.writeFileSync(outputFile, amdclean.clean({
                    globalModules : _globalModules,
                    'filePath': outputFile,
                    'prefixMode': 'camelCase',
                    'wrap': {
                         'start': '\n/* BEGIN CODE */\n',
                         'end'  : '\n/* END CODE   */\n'
                       },
                       'escodegen': {
                         'comment': false,
                         'format': {
                           'indent': {
                             'style': '    ',
                             'adjustMultilineComment': true
                           }
                         }
                       }
                }));
            }
        }, function () {
            taskReady();
        }, function (error) {
            console.error('requirejs task failed', JSON.stringify(error));
            process.exit(1);
        });
    });

    //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //| ✓ umd
    //| > Framework UMD
    //| > https://github.com/umdjs/umd
    //| > https://www.npmjs.com/package/gulp-umd
    //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    gulp.task('umd', ['requirejs-amdclean'], function () {

        var umd  = require('gulp-umd');

        return gulp.src( path.join(build.js, (isDebug ? getDistFileNameDebug() : getDistFileName())) )
            .pipe(umd({
                exports: function (file) {
                    return 'Gp';
                },
                namespace: function (file) {
                    return 'Gp';
                }
            }))
            .pipe(gulp.dest( build.umd ))
            .pipe($.plumber())
            .pipe($.size());
    });

    //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //| ✓ licence
    //| > ajout d'une licence au bundle
    //| > https://www.npmjs.com/package/gulp-header
    //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    gulp.task('licence', function () {

        // pour information,
        // le fichier de licence peut être un template,
        // les balises en nottion ES6-style : ${date}
        var fs = require('fs');
        var licence = path.join(_.utils, "licence-template.txt");

        return gulp.src([ path.join(build.umd, (isDebug? getDistFileNameDebug() : getDistFileName())) ])
                .pipe($.header(fs.readFileSync(licence, 'utf8'), {
                     date : buildDate,
                     version : npmConf.version
                }))
                .pipe(gulp.dest( path.join(build.dist, getDistDirName())) )
                .pipe($.plumber())
                .pipe($.size()) ;
    });

    //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //| ✓ sources
    //| > copie des sources js
    //| > https://www.npmjs.com/package/gulp-replace
    //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    gulp.task('sources', function () {

        return gulp.src([ path.join(_.src, '**/*.js') ])
                .pipe($.replace(/__GPSDKVERSION__/g,npmConf.version))
                .pipe($.replace(/__GPDATE__/g,buildDate))
                .pipe(gulp.dest(build.src))
                .pipe($.plumber())
                .pipe($.size()) ;
    });

    //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //| ✓ copy-sample
    //| > copie des pages d'exemples
    //| > TODO mettre en place une regex pour prendre en compte virtualglobe
    //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    gulp.task('copy-sample', function () {

        return gulp.src([ path.join(_.sample, '**/*.html'), path.join(_.sample, '**/*.js') ])
                .pipe($.replace('GpOl3.js', (isDebug) ? getDistFileNameDebug() : getDistFileName()))
                .pipe(gulp.dest(build.sample))
                .pipe($.plumber())
                .pipe($.size());
    });

    // |**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // | ✓ template-sample
    // | > construction de la page principale des exemples leaflet ou ol3
    // | > https://www.npmjs.com/package/gulp-template
    // | > FIXME la liste des exemples est déjà constituée !
    //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    gulp.task("template-sample", ['copy-sample'], function () {

        var tmpl = require("gulp-template");
        var glob = require("glob");

        // uniquement les html !
        var lstSources = glob.sync("**/*.html" , {
            cwd : build.sample , nodir : true, ignore : "index-samples.html"
        });

        console.log(lstSources);

        return gulp.src(path.join(_.sample, "index-samples.html"))
            .pipe(tmpl({
                'files' : lstSources
            }))
            .pipe(gulp.dest(build.sample));
    });

    //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //| ✓ lib
    //| > copie des pages d'exemples
    //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    gulp.task('lib', function () {
        return gulp.src([ path.join(_.lib, '**') ])
                .pipe(gulp.dest(build.lib))
                .pipe($.plumber())
                .pipe($.size());
    });

    //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //| ✓ copy images
    //| > https://github.com/hparra/gulp-rename
    //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    gulp.task("res-images", function () {

        var rename = require("gulp-rename");

        var builddir = path.join(build.dist, getDistDirName(), "img");
        var srcdir   = [];
        var svgdir   = null;

        if (isOl3) {
            srcdir.push(path.join(_.lib, "external", "geoportail", "plugins-ol3", "**", "*.png"));
            svgdir = path.join(_.lib, "external", "geoportail", "plugins-ol3", "**", "*.svg");
        }
        else if (isVG) {
            srcdir.push(path.join(_.lib, "external", "geoportail", "plugins-vg", "**", "*.png"));
        }
        else if (isMix) {
            srcdir.push(path.join(_.lib, "external", "geoportail", "plugins-mix", "**", "*.png"));
            svgdir = path.join(_.lib, "external", "geoportail", "plugins-mix", "**", "*.svg");
        }
        else {
            $.util.log("Exception !");
        }

        if (svgdir) {
            srcdir.push(svgdir) ;
        }

        return gulp.src(srcdir)
            .pipe(rename({dirname :""}))
            .pipe(gulp.dest(builddir))
            .pipe($.plumber())
            .pipe($.size());

    });

    //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //| ✓ copy virtualGeo Engine - ONLY for VG build or Mix build
    //| > https://github.com/hparra/gulp-rename
    //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    gulp.task("copy-vg-engine", function () {

        var rename = require("gulp-rename");

        // TODO
        // doit on mettre la lib. dans un répertoire distinct ?
        // ex. vendor
        var builddir = path.join(build.dist, getDistDirName());
        var srcdir   = path.join(_.lib, "external", "virtual", "js", "VirtualGeoWeb-Engine.js");

        return gulp.src(srcdir)
            .pipe(rename({dirname :""}))
            .pipe(gulp.dest(builddir))
            .pipe($.plumber())
            .pipe($.size());
    });

    //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //| ✓ minify css with clean-css
    //| > https://www.npmjs.com/package/gulp-clean-css
    //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    gulp.task("res-styles", function () {

        // pour information,
        // le fichier de licence peut être un template,
        // les balises en nottion ES6-style : ${date}
        var licence = path.join(_.utils, "licence-template.txt");

        var fs = require('fs');
        var header  = require("gulp-header");
        var minifyCss = require("gulp-clean-css");
        var concat    = require("gulp-concat");

        // licence pour information,
        // le fichier de licence peut être un template,
        // les balises en nottion ES6-style : ${date}
        var licence = path.join(_.utils, "licence-template.txt");

        var builddir = path.join(build.dist, getDistDirName());
        var srcdir   = [];

        if (isOl3) {
            srcdir.push(path.join(_.lib, "external", "geoportail", "plugins-ol3", "**", "*-src.css"));
            srcdir.push(path.join(_.lib, "external", "ol3", "*.css"));
            srcdir.push(path.join(_.res, "ol3", "*.css"));
        }
        else if (isVG) {
            srcdir.push(path.join(_.lib, "external", "geoportail", "plugins-vg", "**", "*-src.css"));
            srcdir.push(path.join(_.res, "virtual", "*.css"));
        }
        else if (isMix) {
            srcdir.push(path.join(_.lib, "external", "geoportail", "plugins-mix", "**", "*-src.css"));
            srcdir.push(path.join(_.lib, "external", "ol3", "*.css"));
            srcdir.push(path.join(_.res, "ol3", "*.css"));
            srcdir.push(path.join(_.res, "virtual", "*.css"));
        }
        else {
            $.util.log("Exception !");
        }

        return gulp.src(srcdir)
            .pipe((isProduction) ? minifyCss({keepSpecialComments : 0}) : $.util.noop())
            .pipe((isProduction) ? concat(getBaseFileName() + ".css") : concat(getBaseFileName() + "-src.css"))
            // licence
            .pipe(header(fs.readFileSync(licence, "utf8"), {
                date : buildDate,
                version : npmConf.version
            }))
            .pipe(gulp.dest(builddir))
            .pipe($.plumber())
            .pipe($.size());
    });

    //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //| ✓ libdoc
    //| > copie du template jaguarjs-jsdoc
    //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    gulp.task('libdoc', function () {
        return gulp.src([ path.join(_.doc, '**') ])
                .pipe(gulp.dest(build.doc))
                .pipe($.plumber())
                .pipe($.size());
    });

    //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //| ✓ publish
    //| > copie du bundle pour distribution
    //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    gulp.task('publish', function () {

        return gulp.src([ path.join(build.dist, '**/*') ])
                .pipe(gulp.dest(_.dist))
                .pipe($.plumber())
                .pipe($.size()) ;
    });

    //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //| ✓ connect to web server for test
    //| > https://www.npmjs.com/package/gulp-connect
    //| > http://localhost:9001
    //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    gulp.task('connect', $.connect.server({
        root: [_.root],
        livereload: true,
        port: 9001
    }));

    //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //| ✓ server web test
    //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    gulp.task('server-test', ['connect'], function () {
        var open = require('open');
        open("http://localhost:9001/test/index.html");
    });

    //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //| ✓ server web sample
    //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    gulp.task('server-sample', ['connect'], function () {
        var open = require('open');
        open("http://localhost:9001/target/samples/index-samples.html");
    });

    //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //| ✓ watch test change
    //| > https://www.npmjs.com/package/gulp-watch
    //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    gulp.task('watch', ['server-test'], function () {
        $.watch({glob: [ path.join(_.test, 'spec/**/*.js') ]}, function () {
            gulp.start('mocha-phantomjs');
        });
    });

    //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //| ✓ clean
    //| > nettoyage
    //| > https://www.npmjs.com/package/gulp-clean
    //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    gulp.task('clean', [], function () {

        var stream = gulp.src([
            build.dist,
            build.js,
            build.umd,
            build.doc,
            build.src,
            build.sample,
            build.lib
        ], {force: true});
        return stream.pipe($.clean());
    });

    //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //| ✓ clean
    //| > nettoyage brutal
    //| > https://github.com/robrich/gulp-rimraf
    //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    gulp.task('clean-rimraf', [], function (cb) {
        var rimraf = require('rimraf');
        rimraf("./target", cb);
    });

    //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //| ✓ help
    //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    gulp.task('help', function () {
        $.util.log("Liste des 'target' principales :");
        $.util.log(" - build : construction complète du projet.");
        $.util.log(" -- dist : construction de la librairie.");
        $.util.log(" -- check: controle des sources.");
        $.util.log(" -- test : execution des tests unitaires.");
        $.util.log(" -- doc  : construction de la JSDOC.");
        $.util.log(" -- publish : publication de la librairie.");
    });

    //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //| ✓ tâche = alias
    //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    gulp.task('test',         ['mocha-phantomjs']);
    gulp.task('test-cloud',   ['server-test']);
    gulp.task('check',        ['jsonlint', 'jshint', 'jscs']);
    gulp.task('src',          ['sources', 'lib']);
    gulp.task("res",          ["res-styles", "res-images"]);
    gulp.task('sample',       ['template-sample']);
    gulp.task('sample-cloud', ['server-sample']);
    gulp.task('dist',         ['build-dist']);  // task sync
    gulp.task('doc',          ['build-doc']);   // task sync

    //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //| ✓ synchronisation des tâches
    //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    var runSequence = require('run-sequence');

    gulp.task("build", function(cb) {

        if (isOl3) {
            gulp.start("build-ol3");
        }
        else if (isVG) {
            gulp.start("build-vg");
        }
        else if (isMix) {
            gulp.start("build-mix");
        }
        else {
            // TODO erreur !
        }

    });

    gulp.task("build-ol3", function(cb) {
        isVG = false;
        isOl3 = true;
        $.util.log("# Run task for OpenLayers3...");
        runSequence('check', 'test', 'sample', 'res', 'dist', 'doc', cb);
    });

    gulp.task("build-vg", function(cb) {
        isVG = true;
        isOl3 = false;
        $.util.log("# Run task for VirtualGeo 3D...");
        runSequence('check', 'test', 'sample', 'res', 'dist', 'doc', 'copy-vg-engine', cb);
    });

    gulp.task("build-mix", function(cb) {
        isMix = true;
        isVG  = false;
        isOl3 = false;
        $.util.log("# Run task for VirtualGeo 3D with OpenLayers3...");
        runSequence('check', 'test', 'sample', 'res', 'dist', 'copy-vg-engine', cb);
    });

    gulp.task('build-dist', function(callback) {
        runSequence('src', 'umd', 'licence', callback);
    });

    gulp.task('build-doc', function(callback) {
        runSequence('libdoc', 'jsdoc', callback);
    });

    //|**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //| ✓ tâche par default
    //'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    gulp.task('default', ['clean'], function () {
        gulp.start('build');
    });

}(require('gulp'), require('gulp-load-plugins')));
