# SDK Geoportail 2D/3D, version __VERSION__

**__DATE__ : version __VERSION__**

> Release SDK Geoportail 2D/3D

## Summary

- Option d'export et import des couches de calcul

## Changelog

* [Added]

    - Option d'export des tracés et des calculs au format GPX, KML et GeoJSON sur les contôles d'itineraire, d'isochrone et de profil altimétrique (#105):

        ```js
            Gp.Map.load('map', {
                configUrl : ,
                azimuth : ,
                zoom : ,
                center : {},
                layersOptions : {},
                controlsOptions : {
                    route : {
                        export : true
                    },
                    isocurve : {
                        export : {
                            format : "gpx",
                            name : "export-iso",
                            title : "Exporter",
                            menu : true
                        }
                    },
                    elevationPath : {
                        export : false
                    }
                }
            });
        ```

    - Imports des couches de calculs (itineraire, isochrone et profil altimétrique) au format GPX, KML et GeoJSON (#105).

* [Changed]

    - Mise à jour de l'extension geoportail pour itowns en version 2.3.11
    - Mise à jour de l'extension geoportail pour openlayers en version 3.2.22 (#105)

* [Removed]

* [Fixed]

    - Correction du passage des options du service d'alti pour le controle de profil altimetrique (#104)

* [Deprecated]

* [Security]
