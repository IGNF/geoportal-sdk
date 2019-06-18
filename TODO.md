# Migration vers OpenLayers v5 & MapBox

Cette branche est clonée sur [feature-mapbox] :

    commit 028710f630d0aa0de44debf4522e86c9ed05df91
    Author: lowzonenose <jpbazonnais@gmail.com>
    Date:   Tue Feb 12 11:00:34 2019 +0100

        gestion des erreurs (mapbox)

> **INFO**
Prise en compte des dev sur itowns 2.8.0 (branche itowns_v2.8.0)
**UPGRADE v2.9.0**

## Avancements & TODOLIST

* [x] **OK** Migrer vers ol v5.3.0
* [x] **OK** Migrer vers itowns v2.8.0 = **UPGRADE EN v2.9.0**
* [x] **OK** Migrer vers olms 4.2.1

* [ ] **PROGRESS** Migrer vers webpack 4

    - [x] **OK** 2d

    - [x] **OK** 3d

    - [ ] **PROGRESS** La taille des bundles trop élevée ?
    => une analyse du bundle est à faire...
    
    cf. <https://webpack.js.org/configuration/devtool>
    cf. <https://github.com/webpack/webpack/tree/master/examples/source-map>

    | NEW | 2D  | 3D  |
    |-----|-----|-----|
    |prod | 1.9 |**3.0** |
    |map  | **16**  | **24**  |
    |src  | 6.1 | 8.7 |

    | OLD | 2D  | 3D  |
    |-----|-----|-----|
    |prod | 1.4 | 1.4 |
    |map  | 7.8 | 8.5 |
    |src  | 2.9 | 3.2 |

    > 3D : *FIXME* doublon des fichiers communs du DOM sur les extensions !?
    > 3D : *FIXME* CSS sur les extensions openlayers ?

    - [x]  Les commentaires et les copyright sont supprimés dans les css/js minifiées ! la migration vers webpack 4 ne semble pas resoudre le pb...
    > **OK** on fait le choix de ne pas supprimer les banners mais certaines sont en doublons...

    - [x] en mode production, le bundle ne marche pas !?
    > **OK** on avait oublié de rendre externe la lib. itowns dans webpack...

* [ ] Tests à jouer & à créer
    > npm run test:serve

    - [x] OlMAp
    - [ ] ItMap : exceptions itowns...
    - [x] SDK2D
    - [ ] SDK3D : exceptions itowns...

    cf. <https://github.com/iTowns/itowns/issues/1108>

* [x] Exemples à jouer & à créer

    cf. *BUG*

    >  **OK** webpack-dev-server et le proxy php déployé en local

    - [x] **OK** 2D
        > npm run sample:2d:serve

    - [x] **OK** 3D
        > npm run sample:3d:serve

    - [ ] exemples AMD/ES6 à supprimer.
        > realisation d'un exemple dans le projet 3rd Party...

* [ ] integration du SDK dans le projet 3rd Party...

* [ ] **PROGRESS** integration du SDK dans le portail..

    - **FIXME** il faut charger les SRS étendues pour le controle MousePosition...
        > Gp.olExtended.includeProjections()

    - **FIXME** warning et exceptions sur la 3D non bloquantes
    - **FIXME** bug du tilt 3D

* [x] **FAIT** dependances des projets geoportal-extensions-* dans webpack

    - [x] 2D : ça compile !
    - [x] 3D : ça compile !

* [x] **FAIT** gestion des variables globales
        ex. Gp, ol, itowns, proj4
        - ol contient nos evolutions
        - Gp.olExtended est fusionné avec ol
        - proj4 doit être fonctionnel avec nos CRS !

* [x] **FAIT** intégrer le mode mixte dans le sdk = 3d !

    > 3d avec les dependances geoportal-extensions-openlayers et
    geoportal-extensions-itowns, le mode mixte est abandonné !

* [x] **FAIT** utilisation : npm-run-all

* [x] **FAIT** maj du script de publication (package)

    - [x] **FAIT** script de packaging 2d & 3d
        > cd scripts/release/
        > ./build-pack.sh --2d | --3d | --all

    - [x] **FAIT** packaging de l'ensemble du SDK
        > npm pack

    - [x] **FAIT** gestion auto de la version du package

    - [ ] **TODO** gestion auto de la liste des dependances et les version des dependances

* [x] **FAIT** changelog & draft
    > https://api.github.com/repos/IGNF/geoportal-sdk/releases

* [x] **FAIT** jsdoc pour la variable globale Gp / exports

* [ ] **TODO** jsdoc pour l'outil importlayer du format MapBox (ex. defaultstyle)

    ```text
    les options 'tools' sur l'edition des filtres, scales & styles sont elles à mettre en place dans le SDK ? Definies par defaut ?
    idem pour l'édition ?
    ```

* [ ] **TODO** jsdoc pour la couche de type MapBox

* [x] **FAIT** TOC dans les README

* [x] **FAIT** rubrique howto (ex. publication des releases)

* [ ] **PROGRESS** il faut se conformer au CCTP sur l'implementation des options du vecteur tuilé :

    ```text
    ce que dit le CCTP sur les options du format vecteur tuilé  :
        Format,
        UrlService,
        OutputFormat,
        Projection,
        Queryable,
        Name, DefaultThemeDescription, Url, QuicklookUrl,
        Themes : [Name, DefaultThemeDescription, Url, QuicklookUrl]
        Filters : [PropertyName, FilterName]
    ```

    ```text
    ce qui est implementer pour le moment :
        [ ] Format,
            opts:format
            valeurs : "MapBox" ou "MAPBOX" ou "mapbox"
            > gerer les differentes casses !

        [ ] UrlService,
            opts:urlService
            attention, ce n'est pas l'opts commune "url" : opts:url = style !
            ```
            si opts:url existe
                si opts:urlService renseignée
                    surcharger le fichier de styles
                appliquer les styles
            sinon
                appliquer opts:stylesDefault
            ```
            > implementation à faire...

        [ ] OutputFormat,
            comment l'utiliser sur un service vecteur tuilé ???
            opts:outputFormat
            valeur : application/x-protobuf

        [ ] Projection,
            comment l'utiliser sur un service vecteur tuilé ???
            opts:projection

        [ ] Queryable,
            opts:queryable
            option est dependante du controle GFI

        [ ] Name, DefaultThemeDescription (=>Description), Url, QuicklookUrl (=>Thumbnail),
            > revoir l'implementation : opts:style === opts:url !!!
            > implementer opts:name, opts:description, opts:thumbnail
            attention, il existe une option quicklookurl pour l'image dans le LS !!!

        [ ] Themes : [Name, DefaultThemeDescription (=>Description), Url, QuicklookUrl (=>Thumbnail)]
            > revoir l'implementation des noms :
            [{image, label, desc, style}] -> [{Thumbnail, Name, Description, Url}]

        [ ] Filters : [PropertyName, FilterName]
            > revoir l'implementation :
            [[]] -> [{PropertyName, FilterName, Configuration?}]
    ```

## BUG 2D

x├── page-azimuth-bundle-map.html

x├── page-center-bundle-map.html

x├── page-changeLayersColor-bundle-map.html

    - 403 Forbidden WFS
    => **OK** changement de ressources !

    curl 'https://wxs.ign.fr/jhyvi0fgmnuxvfv0zjzorvdn/geoportail/wfs?service=WFS&request=GetFeature&version=2.0.0&typename=LIMITES_ADMINISTRATIVES_EXPRESS.LATEST:arrondissement_departemental&outputFormat=application/json&srsname=EPSG:3857&bbox=214329.4273116342,6220292.4877910735,307888.3499326899,6282359.354758636,EPSG:3857&count=200' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36' -H 'Referer: https://localhost:9001/samples/2d/page-changeLayersColor-bundle-map.html' -H 'Origin: https://localhost:9001' --compressed

    - 403 Forbidden WMS externe
    => **OK** desactivation de la ressource !

    curl 'https://services.data.shom.fr/INSPIRE/wms/r?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=TRUE&LAYERS=BATHY-DALLE_PYR-PNG_3857_WMSR&WIDTH=256&HEIGHT=256&CRS=EPSG%3A3857&STYLES=&BBOX=234814.55089206249%2C6222585.598639628%2C273950.3093740727%2C6261721.357121638' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36' --compressed

    - **OK** [bug ChangeLayerColor] Exception sur le passage en gris !?
    > TypeError: Cannot assign to read only property 'target' of object '#<CustomEvent>'

x├── page-controls-bundle-map.html
    - "mixed content" avec le serveur de tuiles OSM en http..., mais pas possible de changer le protocole en https...

x├── page-controlsOptions-bundle-map.html

!├── page-div-bundle-map.html
    - [bug twomaponsinglepage] la 1ere carte est vide !?
    on a l'impression que la 1ere carte n'a pas eu le temps de s'instancier car
    la 2eme carte a stoppé son deroulement !?
    => **NOK** c'est un bug natif !?

x├── page-drawing-bundle-map.html

x├── page-events-bundle-map.html

x├── page-exportmap-bundle-map.html

x├── page-geojson-bundle-map.html

x├── page-geolocate-bundle-map.html

x├── page-gfi-bundle-map.html

    - [bug GetFeatureInfo] selection impossible sur POI Ecoles...
    => **OK** changement de ressources !

    - 403 Forbidden sur 'ADMINISTRATIVEUNITS.BOUNDARIES'
    => **OK** desactivation de la ressource !

    curl 'https://wxs.ign.fr/an7nvfzojv5wa96dsga5nk8w/geoportail/r/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=TRUE&LAYERS=ADMINISTRATIVEUNITS.BOUNDARIES&CRS=EPSG%3A3857&STYLES=&WIDTH=924&HEIGHT=751&BBOX=20494.678208962883%2C6394107.90145443%2C24908.916592431815%2C6397695.664469566' -H 'Referer: http://localhost/geoportal-sdk/samples/2d/page-gfi-bundle-map.html' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36' --compressed

x├── page-gfi-mapbox-bundle-map.html
    - **OK** [bug GetFeatureInfo] selection impossible

x├── page-gfi-wms-bundle-map.html
    - [bug GetFeatureInfo] selection impossible
    => **OK** changement de ressources !

x├── page-gpplayer-bundle-map.html

x├── page-gpx-bundle-map.html
    - **OK** [bug GetFeatureInfo] selection impossible

x├── page-graphicScale-bundle-map.html

x├── page-interaction-bundle-map.html
    - **OK** [bug GetFeatureInfo] selection impossible
    - navigation clavier ?

x├── page-kml-bundle-map.html
    -  **OK** modification de l'url du kml...

x├── page-kml-drawing-bundle-map.html

x├── page-layersOptions-bundle-map.html

x├── page-layersPosition-bundle-map.html

x├── page-local-config-bundle-map.html

!├── page-mapbox-accesstoken-bundle-map.html
    - **NOK** l'option queryable ne semble pas fonctionner !?

x├── page-mapbox-geojson-bundle-map.html

x├── page-mapbox-geojson-failed-bundle-map.html
    - style openlayers par defaut / couche masqué dans le LS

x├── page-mapbox-geojson-filter-bundle-map.html

x├── page-mapbox-geojson-metadata-bundle-map.html

x├── page-mapbox-geojson-multisources-bundle-map.html

x├── page-mapbox-geojson-themes-object-bundle-map.html

x├── page-mapbox-geojson-themes-url-bundle-map.html
    - **INFO** non fonctionnel pour le moment...

x├── page-mapbox-geoportail-autoconf-bundle-map.html
    - **INFO** non fonctionnel pour le moment...

x├── page-mapbox-layerimport-bundle-map.html
    - **OK** [bug LayerImport MapBox]

x├── page-mapbox-osm-bundle-map.html

x├── page-mapOptions-bundle-map.html

x├── page-marker-bundle-map.html

x├── page-maxminZoom-bundle-map.html

x├── page-measures-bundle-map.html

x├── page-measures-without-toolbox-bundle-map.html

x├── page-modifyLayers-bundle-map.html

x├── page-originators-bundle-map.html
    - **OK** [bug Attributions] l'attribution OSM s'affiche sur la carte ainsi que dans le controle (fonctionnement natif d'openlayers) mais ça ne devrait pas être le cas pour les autres attributions.

x├── page-osm-bundle-map.html

x├── page-projection-bundle-map.html
    - **OK** [bug Projections] hummm..., pb avec les projections !?
    les extends sur les projections ne sont pas renseignées...

x├── page-removeLayers-bundle-map.html

x├── page-styleOptions-bundle-map.html

x├── page-wfs-bundle-map.html
    - pb avec cette couche !?
    > ERR_CONNECTION_TIMED_OUT

    curl 'https://demo.boundlessgeo.com/geoserver/wfs?service=WFS&request=GetFeature&version=1.1.0&typename=ne:ne_10m_roads&outputFormat=application/json&srsname=EPSG:3857&bbox=-15945375.59651405,9788831.59031281,-13988587.672413535,11256422.533388196,EPSG:3857&maxFeatures=200' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36' -H 'Referer: http://localhost/geoportal-sdk/samples/2d/page-wfs-bundle-map.html' -H 'Origin: http://localhost' --compressed

    => **OK** changement de ressources !

x├── page-wfs-geoportail-bundle-map.html

x├── page-wms-bundle-map.html

x├── page-wmsc-espagne-bundle-map.html
    - erreur connue du service...

x├── page-wmsc-geologie-bundle-map.html

x├── page-wms-gfi-bundle-map.html
    - interêt de cet exemple !?

x├── page-wmts-bundle-map.html

x├── page-wmts-geoportail-bundle-map.html

x└── page-wmts-restful-bundle-map.html
    - [bug Attributions] la liste des attributions sur la couche photos contient des doublons
    === pb autoconf !

- *OK*  [webpack] commentaires dans CSS/JS !?
- *OK*  [webpack] minification/compression à revoir !?
- *NOK* [bug twomaponsinglepage] natif, déjà présent sur la release !
- *OK*  [bug Projections]
- *OK*  [bug LayerImport MapBox]
- *OK*  [bug ChangeLayerColor] Exception à tester sur d'autres navigateurs comme IE !
- *OK*  [bug GFI]
- *NOK* [evol Attributions] les doublons (hack possible au niveau de l'API) ?

## BUG 3D

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

├── page-mapbox-bundle-map.html
    - **INFO** non fonctionnel...

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

## EVOL

- [x] options pour le Graticule (ex. intervals & showLabels & ...)

- [ ] position dans le layerswitcher avec l'option position pour le vecteur tuilé !?

- [ ] implementer l'option *queryable* pour le vecteur tuilé :

    ```text
    le widget *getfeatureinfo* fait le boulot de requeter les features.
    sans ce widget, impossible de requeter le vecteur !
    avec ce widget, il est possible via l'option *queryable* de la couche de modifier
    le comportement par defaut du widget (false, no request !)
    donc attention :
        si le widget est desactivé ou non instancié sur la carte, qqsoit l'option
        queryable de la couche, pas de requetage des features !!!
    ```

- [ ] implementer le format MapBox dans la 3D

- [ ] implementer le flux Geoportal de type MapBox