# SDK Geoportail 2D/3D, version __VERSION__

**__DATE__ : version __VERSION__**

> Release SDK Geoportail 2D/3D

## Summary

- Option d'export et import des couches de calcul

## Changelog

* [Added]

    - Option d'export des tracés et des calculs au format GPX, KML et GeoJSON sur les contôles d'itineraire, d'isochrone et de profil altimétrique :

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

    - Imports des couches de calculs (itineraire, isochrone et profil altimétrique) au format GPX, KML et GeoJSON.

* [Changed]

* [Removed]

* [Fixed]

* [Deprecated]

* [Security]
