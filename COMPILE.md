
# Compilation du projet
[![WEBPACK build](https://img.shields.io/badge/build%20with-WEBPACK-brightgreen.svg)](https://img.shields.io/badge/build%20with-WEBPACK-brightgreen.svg)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

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
                 build[:dev|:prod|:2d[:prod]|:3d[:prod],
                 doc:serve,
                 test

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
    npm install https://github.com/IGNF/geoportal-extensions/tarball/master --no-save

Upgrade de version :

**ouvrir une console :**

    // publication openlayers en version 4.4.4
    npm install openlayers@4.4.4 --no-save


### Compilation

**ouvrir une console (ex. avec le SDK 2D) :**

    npm run build:2d
    ou npm run build:2d:prod
    ou npm run build:2d -- --env.production

Les *bundles* sont disponibles dans le répertoire :

	dist/2d/GpSDK2D.js
    dist/2d/GpSDK2D.css
	dist/2d/GpSDK2D-src.js
	dist/2d/GpSDK2D-src.css
    (...)

Les sources sont validées (jshint, jscs et/ou eslint).
La jsoc est générée.

Il est possible de lancer la génération des bundles pour l'ensemble des extensions :

    // génération des bundles en mode développement
    npm run build:dev
    // génération des bundles en mode production
    npm run build:prod
    // génération des bundles dans les deux modes : développement et production
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
