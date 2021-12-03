# SDK Geoportail 2D/3D, version 3.3.4

**03/12/2021 : version 3.3.4**

> Release SDK Geoportail 2D/3D

## Summary

* Possibilité de passer une liste de clés lors de l'initialisation de la carte

## Changelog

* [Added]
    - Possibilité de passer une liste de clés lors de l'initialisation de la carte (#86)
    Exemple :
    ```js
    var map = Gp.Map.load('geoportalMap',{
                apiKey : "jhyvi0fgmnuxvfv0zjzorvdn,administratif",
                azimuth : 45,
                zoom : 13,
                center : {
                    x : -511270,
                    y : 6151620
                },
                layersOptions : {
                    'ORTHOIMAGERY.ORTHOPHOTOS': {
                    },
                    'GEOGRAPHICALGRIDSYSTEMS.MAPS': {
                    },
                    'LIMITES_ADMINISTRATIVES_EXPRESS.LATEST': {
                    }
                }
    }
    ```

* [Changed]

* [Removed]

* [Fixed]

* [Deprecated]

* [Security]
