# Migration vers OpenLayers v5

Cette branche est clonée sur [feature-mapbox] :

    commit 028710f630d0aa0de44debf4522e86c9ed05df91
    Author: lowzonenose <jpbazonnais@gmail.com>
    Date:   Tue Feb 12 11:00:34 2019 +0100

        gestion des erreurs (mapbox)


> **INFO**
> Suite à un probleme de minification à cause de la version de Webpack 3 et ES6...
> on utilise donc une version anterieur du package *uglifyjs-webpack-plugin* > 1.3.0 !
> Lors du passage en Webpack 4, on pourra utiliser la version de minification incluse dans webpack.


## Avancements & TODOLIST

* [ ]  **PROGRESS** Migrer vers ol v5.3.0

* [ ] Migrer vers webpack 4

* [ ] Tests à jour
    > npm run test:serve

* [ ] Exemples à jouer

    - [ ] **PROGRESS** 2D
        > npm run sample:2d:serve

    - [ ] 3D
        > npm run sample:3d:serve

    - [ ] exemples AMD/ES6 à supprimer.
        > realisation d'un exemple dans le projet 3rd Party...

* [ ] integration du SDK dans le projet 3rd Party...

* [ ] **PROGRESS** dependances des projets geoportal-extensions-* dans webpack

    > FIXME sur les commentaires dans les css minifiées !

    - [x] **PROGRESS** 2D : ça compile !
        - [ ] gestion des variables globales Gp, ol, proj4

    - [x] 3D : ça compile !
        - [ ] gestion des variables globales Gp, ol, itowns, proj4

* [x] **FAIT** intégrer le mode mixte dans le sdk = 3d !

    > 3d avec les dependances geoportal-extensions-openlayers et
    geoportal-extensions-itowns

* [x] **FAIT** utilisation : npm-run-all

* [ ] **PROGRESS** maj du script de publication (package)

    - [x] **FAIT** script de packaging 2d & 3d
        > cd scripts/release/
        > ./build-pack.sh --2d | --3d | --all

    - [x] **FAIT** packaging de l'ensemble du SDK
        > npm pack

    - [ ] gestion de la version du package
    - [ ] gestion de la liste des dependances et les version

* [ ] changelog & draft
    > https://api.github.com/repos/IGNF/geoportal-sdk/releases

* [ ] jsdoc pour la variable globale Gp

## BUG !?

- [webpack] commentaires dans CSS !?

- [webpack] ex. page-wmts-bundle.html - variable globale ol (ou itowns) !?

- [mapbox] revoir l'implementation car ça ne passe plus avec la maj des dependances...

- [crs] ex. page-projection-bundle-map.html - hummm..., pb avec les projections !?

- [samples]
    - [elevationpath] le profile ne s'affiche pas !?
    - [gfi] ex. page-gfi-bundle.html - 403 sur certaines couches... POI Ecoles...
    - [gfi & mapbox] exception : "Style error = Can only apply to VectorLayer or VectorTileLayer" !?
    - [gfi] selection impossible des couches vecteurs ?
    - [kml] ex. page-kml-bundle.html - l'url du kml n'existe plus...
    - [layer & wfs] ex. page-layersOptions-bundle
    exception sur le wfs (BDPARCELLAIRE-VECTEUR_WLD_BDD_WGS84G:parcelle unknown)
    - [ol] ex. page-wmts-bundle.html - variable global !?
