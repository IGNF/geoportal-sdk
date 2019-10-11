# Publication d'une nouvelle version du SDK

> En cours de validation...

ex. le SDK 2D/3D Géoportail, version x.y.z.

<!-- toc -->

- [1. Préparation des sources](#1-preparation-des-sources)
  * [a. Mise à jour de la version / date](#a-mise-a-jour-de-la-version--date)
  * [b. Compilation](#b-compilation)
  * [c. Jouer les tests](#c-jouer-les-tests)
  * [d. Visualiser la JSDOC](#d-visualiser-la-jsdoc)
  * [e. Visualiser les exemples](#e-visualiser-les-exemples)
  * [f. Mettre à jour le CHANGELOG](#f-mettre-a-jour-le-changelog)
  * [g. Commit](#g-commit)
- [2. Publication de la JSDOC](#2-publication-de-la-jsdoc)
- [3. Publication sur le GitHub (release)](#3-publication-sur-le-github-release)
- [4. Publication via NPM](#4-publication-via-npm)

<!-- tocstop -->

## 1. Préparation des sources

Sur la branche *master*

Se placer dans le projet *geoportal-sdk*, et recuperer le projet :

    git pull origin master
    ou
    git clone https://github.com/IGNF/geoportal-sdk.git

### a. Mise à jour de la version / date

Modifier le numéro de version dans le fichier *package.json* :

- Pour le SDK *2D* : `"SDK2DVersion"`
- Pour le SDK *3D* : `"SDK3DVersion"`

Ainsi que la date de publication dans le fichier *package.json* :
`"date"` (JJ/MM/AAAA)

### b. Compilation

Nettoyage par précaution des dossiers :

- dist/
- node_modules/
- jsdoc/
- samples/

Construire les bundles :

    npm run setup
    npm run build:2d
    npm run build:3d

Vérifier le contenu du dossier *./dist/2d/* et *./dist/3d/* :

    GpSDK2D(-src|-map).(css|js)
    GpSDK3D(-src|-map).(css|js)

### c. Jouer les tests

En local : **tests unitaires**

    npm run test:serve

> consulter la page : http://localhost:9001/

### d. Visualiser la JSDOC

En local : **jsdoc**

    npm run doc:serve

> consulter la page : http://localhost:9001/

### e. Visualiser les exemples

En local : **pages examples**

    npm run sample:2d:serve
    npm run sample:3d:serve

> consulter la page : https://localhost:9001/

### f. Mettre à jour le CHANGELOG

cf. [howto-generate-changelog](howto-generate-changelog.md)

### g. Commit

Pousser les modifications

    git add -A
    git commit -m "SDK 2D/3D release x.y.z"
    git push origin master

## 2. Publication de la JSDOC

Sur la branche *gh-pages*

Basculer sur la branche *gh-pages*

    git checkout gh-pages
    git pull origin gh-pages

Créer un dossier *vx.y.z/*

    mkdir -p vx.y.z/

Copier le contenu de *./jsdoc/* dans *vx.y.z/jsdoc/*
(doit contenir les fichiers html etc nécessaires à la consultation de la doc)

    cp -r jsdoc/ v3.0.0/jsdoc

Copier aussi le contenu des bundles générés (/dist) dans la bonne arborescence

    cp -r dist/2d/ vx.y.z/dist/2d
    cp -r dist/3d/ vx.y.z/dist/3d


Modifier le lien symbolique *vx.y* pour qu'il pointe vers ce dossier :

    ln -fsn vx.y.z/ vx.y

Si besoin, modifier le lien symbolique *openlayers-latest* pour qu'il pointe vers le lien créé :

    ln -fsn vx.y/ latest

**IMPORTANT**
> Vérifier que les liens ont été modifiés !

Pousser les modifications

    git add -A
    git commit -m "update jsdoc and bundles to release SDK vx.y.z"
    git push

**IMPORTANT**
> la nouvelle doc doit être disponible sur :
https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.LayerOptions.html
et
https://ignf.github.io/geoportal-sdk/v3.0.0/jsdoc/Gp.LayerOptions.html

> les nouveaux bundles doivent être disponibles sur :
https://ignf.github.io/geoportal-sdk/latest/dist/2d/GpSDK2D.js
https://ignf.github.io/geoportal-sdk/latest/dist/3d/GpSDK3D.js

## 3. Publication sur le GitHub (release)

Sur la branche *master*

Basculer sur la branche *master*

    git checkout master

Créer une **archive** à partir du dossier *./dist/* :

    cd dist/
    zip -r GpSDK-2D-x.y.z.zip 2d/
    zip -r GpSDK-3D-x.y.z.zip 3d/

Sur la page des **releases** du GitHub

    https://github.com/IGNF/geoportal-sdk/releases : "Draft a new release"
    Tag : "x.y.z"
    Title : "Release version x.y.z"
    Contenu : cf. **DRAFT_CHANGELOG.md**

**Joindre** l'archive

    GpSDK-2D-x.y.z.zip (dans *./dist/*)
    GpSDK-3D-x.y.z.zip

**Publier** la release

## 4. Publication via NPM

Sur la branche *master*

Se **logguer**

    npm login

**Authentification** NPM

    login : xxxxxxxxxx
    mdp   : xxxxxxxxxx
    email : xxxxxxxxxx

Executer le script de construction du package NPM en fonction du type de librairie :

``` bash
    ./build-pack.sh -h
    [mardi 4 juin 2019, 14:46:16 (UTC+0200)] BEGIN
    Il faut au prealable construire les binaires :
    > npm run build

    Attention, la date et la version sont extraites du package.json principal.
    Par contre, les dependances ne sont pas gérées par le script...

    Usage :
        build-pack.sh - construction du package TGZ à publier dans NPM
        -h|--help          Affiche cette aide.
        -2|--2d            build : 2D,
        -3|--3d            build : 3D,
        -a|--all           build : All.

    Par defaut, les repertoires ne sont pas supprimés.
    Le package validé, on se place dans le répertoire pour la publication :
    > npm login
    > npm publish
```

**IMPORTANT** : Se placer dans le dossier `geoportal-sdk-2d/` ou `geoportal-sdk-3d/`

    cd geoportal-sdk-2d/

Vérifier le contenu du dossier :

    dist/
    src/
    LICENCE.md
    package.json
    README.md

Et vérifier le bon contenu des fichiers (version des bundles, du README, contenu du package.json)

Une fois que tout est bon, lancer la publication sur NPM :

    npm publish

**IMPORTANT**
> controler la disponiblité sur npm : https://www.npmjs.com/package/@ignf-geoportal/sdk-2d ou https://www.npmjs.com/package/@ignf-geoportal/sdk-3d
(peut prendre quelques minutes)
