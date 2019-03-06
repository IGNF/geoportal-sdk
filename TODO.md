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

* [x] **OK** Migrer vers ol v5.3.0

* [x] **OK** Migrer vers olms 3.8.0

* [ ] Migrer vers webpack 4

* [ ] Tests à jouer & à creer
    > npm run test:serve

    cf. BUG

* [ ] Exemples à jouer & à creer

    cf. BUG

    >  *TODO* webpack-dev-server et le proxy.php !?

    - [ ] **PROGRESS** 2D
        > npm run sample:2d:serve

    - [ ] **PROGRESS** 3D
        > npm run sample:3d:serve

    - [ ] exemples AMD/ES6 à supprimer.
        > realisation d'un exemple dans le projet 3rd Party...

* [ ] integration du SDK dans le projet 3rd Party...

* [ ] **PROGRESS** dependances des projets geoportal-extensions-* dans webpack

    > FIXME sur les commentaires dans les css minifiées !

    - [x] 2D : ça compile !
    - [x] 3D : ça compile !
    - [ ] **PROGRESS** gestion des variables globales
        ex. Gp, ol, itowns, proj4

        Pour utiliser openlayers, il faut charger le bundle dans la page :
        `<script src="https://openlayers.org/en/latest/build/ol.js"></script>`
        Du coup, olExtended et ol sont fusionnés !
        Mais, c'est pas très logique..., car on souhaite embarquer openlayers !?

        ```
        - "geoportal-extensions-openlayers" : auto
        - "geoportal-extensions-openlayers" : path.resolve(__dirname, "node_modules", "geoportal-extensions-openlayers", "dist", "GpPluginOpenLayers-src.js")
        > compilation OK
        > proj4 OK
        > Gp OK
        > ol uniquement interne au sdk !

        - "geoportal-extensions-openlayers" : path.resolve(__dirname, "node_modules", "geoportal-extensions-openlayers", "src", "OpenLayers", "GpPluginOpenLayers.js")
        > compilation NOK : pb de loader sur les CSS !?
        ```

* [x] **FAIT** intégrer le mode mixte dans le sdk = 3d !

    > 3d avec les dependances geoportal-extensions-openlayers et
    geoportal-extensions-itowns

* [x] **FAIT** utilisation : npm-run-all

* [x] maj du script de publication (package)

    - [x] **FAIT** script de packaging 2d & 3d
        > cd scripts/release/
        > ./build-pack.sh --2d | --3d | --all

    - [x] **FAIT** packaging de l'ensemble du SDK
        > npm pack

    - [ ] **TODO** gestion auto de la version du package
    - [ ] **TODO** gestion auto de la liste des dependances et les version des dependances

* [ ] changelog & draft
    > https://api.github.com/repos/IGNF/geoportal-sdk/releases

* [ ] jsdoc pour la variable globale Gp / exports

* [ ] TOC dans les README

## BUG 2D !?

x├── page-azimuth-bundle-map.html
x├── page-center-bundle-map.html
!├── page-changeLayersColor-bundle-map.html
    - 403 Forbidden WFS
    > curl 'https://wxs.ign.fr/jhyvi0fgmnuxvfv0zjzorvdn/geoportail/wfs?service=WFS&request=GetFeature&version=2.0.0&typename=LIMITES_ADMINISTRATIVES_EXPRESS.LATEST:arrondissement_departemental&outputFormat=application/json&srsname=EPSG:3857&bbox=214329.4273116342,6220292.4877910735,307888.3499326899,6282359.354758636,EPSG:3857&count=200' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36' -H 'Referer: https://localhost:9001/samples/2d/page-changeLayersColor-bundle-map.html' -H 'Origin: https://localhost:9001' --compressed

    - 403 Forbidden WMS externe
    > curl 'https://services.data.shom.fr/INSPIRE/wms/r?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=TRUE&LAYERS=BATHY-DALLE_PYR-PNG_3857_WMSR&WIDTH=256&HEIGHT=256&CRS=EPSG%3A3857&STYLES=&BBOX=234814.55089206249%2C6222585.598639628%2C273950.3093740727%2C6261721.357121638' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36' --compressed

    - Exception sur le passage en gris !?
    > TypeError: Cannot assign to read only property 'target' of object '#<CustomEvent>'

x├── page-controls-bundle-map.html
    - "mixed content" avec le serveur de tuiles OSM...

?├── page-controlsOptions-bundle-map.html
x├── page-div-bundle-map.html
X├── page-drawing-bundle-map.html
├── page-events-bundle-map.html
├── page-exportmap-bundle-map.html
├── page-geojson-bundle-map.html
├── page-geolocate-bundle-map.html
!├── page-gfi-bundle-map.html
    - selection impossible des couches vecteurs !?
    - 403 sur certaines couches... POI Ecoles...

├── page-gfi-mapbox-bundle-map.html
├── page-gfi-wms-bundle-map.html
├── page-gpplayer-bundle-map.html
├── page-gpx-bundle-map.html
├── page-graphicScale-bundle-map.html
├── page-interaction-bundle-map.html
!├── page-kml-bundle-map.html
    - l'url du kml n'existe plus !?

├── page-kml-drawing-bundle-map.html
├── page-layersOptions-bundle-map.html
├── page-layersPosition-bundle-map.html
├── page-local-config-bundle-map.html
├── page-mapbox-accesstoken-bundle-map.html
├── page-mapbox-geojson-bundle-map.html
├── page-mapbox-geojson-failed-bundle-map.html
├── page-mapbox-geojson-filter-bundle-map.html
├── page-mapbox-geojson-metadata-bundle-map.html
├── page-mapbox-geojson-multisources-bundle-map.html
├── page-mapbox-geojson-themes-object-bundle-map.html
├── page-mapbox-geojson-themes-url-bundle-map.html
!├── page-mapbox-geoportail-autoconf-bundle-map.html
    - refaire une passe sur l'implementation MapBox (ex. avec qmap)
    - possibles exceptions : "Style error = Can only apply to VectorLayer or VectorTileLayer" !?

├── page-mapbox-layerimport-bundle-map.html
├── page-mapbox-osm-bundle-map.html
├── page-mapOptions-bundle-map.html
├── page-marker-bundle-map.html
├── page-maxminZoom-bundle-map.html
├── page-measures-bundle-map.html
├── page-measures-without-toolbox-bundle-map.html
├── page-modifyLayers-bundle-map.html
├── page-originators-bundle-map.html
├── page-osm-bundle-map.html
!├── page-projection-bundle-map.html
    - hummm..., pb avec les projections !?

├── page-removeLayers-bundle-map.html
├── page-styleOptions-bundle-map.html
├── page-wfs-bundle-map.html
├── page-wfs-geoportail-bundle-map.html
├── page-wms-bundle-map.html
├── page-wmsc-espagne-bundle-map.html
├── page-wmsc-geologie-bundle-map.html
├── page-wms-gfi-bundle-map.html
!├── page-wmts-bundle-map.html
     -  exposer ol en variable globale pour l'appel ol.proj.get !?
     - exception sur le wfs (BDPARCELLAIRE-VECTEUR_WLD_BDD_WGS84G:parcelle unknown)

├── page-wmts-geoportail-bundle-map.html
└── page-wmts-restful-bundle-map.html

- [webpack] commentaires dans CSS !?


## BUG 3D !?

├── page-addRemoveControls-bundle-map.html
├── page-azimuth-bundle-map.html
├── page-center-bundle-map.html
├── page-controls-bundle-map.html
├── page-events-bundle-map.html
├── page-exportTo2D-bundle-map.html
├── page-geojson-bundle-map.html
├── page-geolocateLocation-bundle-map.html
├── page-geolocatePosition-bundle-map.html
├── page-gpx-bundle-map.html
├── page-kml-bundle-map.html
├── page-layerSwitcher-bundle-map.html
├── page-miniMap-bundle-map.html
├── page-modifyLayers-bundle-map.html
├── page-mousePosition-bundle-map.html
├── page-removeLayers-bundle-map.html
├── page-scale-bundle-map.html
├── page-switch-bundle-map.html
├── page-test-bundle-map.html
├── page-tilt-bundle-map.html
├── page-wmsExternal-bundle-map.html
├── page-wms-gfi-bundle-map.html
├── page-wmsGpp-bundle-map.html
├── page-zoom-bundle-map.html
└── page-zoomInOut-bundle-map.html
