# Compilation du projet
[![WEBPACK build](https://img.shields.io/badge/build%20with-WEBPACK-brightgreen.svg)](https://img.shields.io/badge/build%20with-WEBPACK-brightgreen.svg)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

<!-- toc -->

- [Prérequis (outils)](#prerequis-outils)
  * [Réglage des outils](#reglage-des-outils)
    + [Gestion des fins de lignes (Git)](#gestion-des-fins-de-lignes-git)
    + [Configuration du proxy d'entreprise](#configuration-du-proxy-dentreprise)
  * [Utilisation du terminal (Console Git ou NodeJS)](#utilisation-du-terminal-console-git-ou-nodejs)
- [Commandes via NPM](#commandes-via-npm)
  * [Installation des dépendances](#installation-des-dependances)
  * [Installation d'une version spécifique d'une dépendance](#installation-dune-version-specifique-dune-dependance)
  * [Compilation](#compilation)
    + [JSDOC](#jsdoc)
    + [Construction de la JSDOC](#construction-de-la-jsdoc)
    + [Ouvrir la JSDOC sur un navigateur](#ouvrir-la-jsdoc-sur-un-navigateur)
  * [Les exemples](#les-exemples)
    + [Construction des exemples](#construction-des-exemples)
  * [Les tests](#les-tests)
    + [Fonctionnels](#fonctionnels)
    + [Tests de rendu](#tests-de-rendu)
- [Carte des sources et des dépendances](#carte-des-sources-et-des-dependances)
- [Analyse (The Official Analyse Tool)](#analyse-the-official-analyse-tool)
- [Carte des sources et des dépendances](#carte-des-sources-et-des-dependances-1)
- [Analyse (The Official Analyse Tool)](#analyse-the-official-analyse-tool-1)

<!-- tocstop -->

## Prérequis (outils)

* nodeJS (https://nodejs.org/en/download/)
* git (https://git-scm.com/downloads)
* git gui (*facultatif*)
* tortoiseGit (*facultatif*)
* Visual Studio Code / VSCode (*facultatif*)

### Réglage des outils

#### Gestion des fins de lignes (Git)

--*Windows only!*--

**ouvrir une console :**

    git config core.autocrlf false
    git rm --cached -r
    git reset --hard

> **Note :**
Possibilité de le faire via l'editeur _Visual Studio Code_ dans le menu
_Fichier > Préférences > Paramètres utilisateurs_
Pour plus d'information, cf. https://code.visualstudio.com/docs/getstarted/settings

#### Configuration du proxy d'entreprise

**ouvrir une console :**

    npm config set proxy http://proxy.company.com:8080
    npm config set https-proxy http://proxy.company.com:8080

ou

sous *Windows*, modifier le fichier _C:\\Users\< USER >\\.npmrc_
(sous *Linux*, on utilise le fichier _$HOME/.npmrc_ )
avec les lignes suivantes :

    proxy=http://proxy.company.com:8080
    https-proxy=http://proxy.company.com:8080
    https_proxy=http://proxy.company.com:8080

ou

sous *Windows*, déclarer les variables d'environnement suivantes :

    HTTP_PROXY
    HTTPS_PROXY

### Utilisation du terminal (Console Git ou NodeJS)

--*Windows only!*--

**Git** et **NodeJS** fournissent leur propre console.
L'utilisation de ces consoles permet d'avoir un environnement complet (ex. variables systèmes), mais il est tout à fait possible d'utiliser la console de *Windows* (CMD).

> **Note :**
Possibilité d'utiliser le terminal de _Visual Studio Code_ dans le menu
_Affichage > Integred Terminal_
Pour plus d'information, cf. https://code.visualstudio.com/docs/editor/integrated-terminal

## Commandes via NPM

Liste des targets disponibles :

    npm run <target>
        target : (clean), setup,
                 build[:dev|:prod|:2d[:dev|:prod]|:3d[:dev|:prod]],
                 doc:serve,
                 test:serve
        option : --env.production,
                 --env.development,
                 (--env.clean)

### Installation des dépendances

**ouvrir une console :**

    npm install

Si vous passez par les commandes du package.json, les dépendances sont installées via
la target suivante :

**ouvrir une console :**

    npm run setup


### Installation d'une version spécifique d'une dépendance

Orienté developpement :

**ouvrir une console :**

    // branche master du depot "IGNF/geoportal-access-lib" (dev)
    npm install https://github.com/IGNF/geoportal-access-lib/tarball/master --no-save

ou par simple copie des bundles dans le répertoire *node_modules* :

    // version spécifique des extensions
    cp pathTo/GpPluginOpenLayers*  node_modules/geopoartal-extensions-openlayers/dist/
    cp pathTo/GpPluginItowns*  node_modules/geopoartal-extensions-itowns/dist/
    cp pathTo/GpPluginOlItowns*  node_modules/geopoartal-extensions-openlayers-itowns/dist/

Upgrade de version :

**ouvrir une console :**

    // publication openlayers en version 4.4.4
    npm install openlayers@4.4.4 --no-save


### Compilation

**ouvrir une console (ex. avec le SDK 2D) :**

    npm run build:2d
    ou npm run build:2d:prod
    ou npm run build:2d:dev
    ou npm run build:2d -- --env.production
    ou npm run build:2d -- --env.development

Les *bundles* sont disponibles dans le répertoire :

	dist/2d/GpSDK2D.js
    dist/2d/GpSDK2D.css
	dist/2d/GpSDK2D-src.js
	dist/2d/GpSDK2D-src.css
    dist/2d/GpSDK2D-map.js
	dist/2d/GpSDK2D-map.css

Les sources sont validées (jshint, jscs et/ou eslint).
La jsoc est générée.

Il est possible de lancer la génération des bundles pour l'ensemble des extensions :

    // génération des bundles en mode développement (cad sourcemap)
    npm run build:dev
    // génération des bundles en mode production
    npm run build:prod
    // génération des bundles en mode sources
    npm run build

#### JSDOC

#### Construction de la JSDOC

La jsdoc est générée lors du build dans le répertoire *jsdoc*.

Sous *Windows*, il est possible que la *JSDoc* ne soit pas compilée correctement
(problème de *path* du binaire), on peut l’exécuter manuellement :

**ouvrir une console :**

    node_modules\.bin\jsdoc -c jsdoc.json

#### Ouvrir la JSDOC sur un navigateur

**ouvrir une console :**

    npm run doc:serve

Le navigateur s'ouvre sur la page de la JSDOC sur l'URL suivante :
http://localhost:9001/

### Les exemples

#### Construction des exemples

Les exemples sont générées lors du build dans le répertoire *samples*.
Mais il est aussi possible de les executer autrement :

**ouvrir une console :**

    npm run sample:(2d|3d):serve

Le navigateur s'ouvre sur la page des exemples sur l'URL suivante :
http://localhost:9001/

### Les tests

#### Fonctionnels

**ouvrir une console :**

    npm run test:serve

Le navigateur s'ouvre sur la page des tests sur l'URL suivante :
http://localhost:9001/

**Note**
> les tests unitaires sont disponibles aussi sur la page de Tests

#### Tests de rendu

**ouvrir une console :**

    cd test_rendering
    npm install
    node server.js
    npm run test[:ol|:it|:ll]

## Carte des sources et des dépendances

cf. https://github.com/webpack-contrib/webpack-bundle-analyzer

**ouvrir une console :**

    sudo npm install -g webpack-bundle-analyzer
    webpack-bundle-analyzer map-ol.json

Le navigateur s'ouvre  sur l'URL suivante :
http://localhost:8888/

## Analyse (The Official Analyse Tool)

Aller sur l'URL suivante :
http://webpack.github.io/analyse/

puis, utiliser le fichier *map-[ol|it|mix|ll].json*

## Carte des sources et des dépendances

cf. https://github.com/webpack-contrib/webpack-bundle-analyzer

**ouvrir une console :**

    sudo npm install -g webpack-bundle-analyzer
    webpack-bundle-analyzer map-2d.json

Le navigateur s'ouvre  sur l'URL suivante :
http://localhost:8888/

## Analyse (The Official Analyse Tool)

Aller sur l'URL suivante :
http://webpack.github.io/analyse/

puis, utiliser le fichier *map-[2d|3d].json*
