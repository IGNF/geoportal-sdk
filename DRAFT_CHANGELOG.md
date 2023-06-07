# SDK Geoportail 2D/3D, version __VERSION__

**__DATE__ : version __VERSION__**

> Release SDK Geoportail 2D/3D

## Summary

L'autoconfiguration n'est plus appelée par les API. Pour la remplacer, nous générons quotidiennement, à partir des getCapabilities des services WMS et WMTS, des fichiers de configuration en JSON appelables par les API JavaScript Géoportail. Il y a un fichier par clé générique. L'avantage de ce nouveau processus (en plus de s'adapter au futur arrêt du service d'autoconfiguration) est que les fichiers de configuration JSON sont directement au format attendu par les API : il n'y a plus besoin de les parser pour en extraire les informations utiles puis pour les introduire dans une structure adéquate.
Par exemple, en renseignant "cartes" au paramètre apiKey, c'est le fichier cartesConfig.json qui sera chargé et directement utilisé par les API. 

A noter que le multiKeys est toujours géré, c'est à dire qu'il est possible de renseigner plusieurs clés dans le paramètre apiKey.

Il est également possible de générer son propre fichier de configuration à partir d'une ou plusieurs clés. L'utilitaire est temporairement disponible ici : https://geoportal-configuration.onrender.com. Le paramètre permettant ensuite de charger sa configuration personnelle à partir du fichier local généré s'appelle désormais **customConfigFile**, auquel on associera le chemin vers le fichier de configuration json à charger.


## Changelog

* [Added]

    - gestion et utilisation des fichiers de configuration en json au lieu de l'appel au service d'autoconfiguration (#106).

* [Changed]

    - **BC** : paramètre "customConfigFile" pour un fichier de configuration local (#106)

##### Avant :

```javascript
        var map = Gp.Map.load("viewerDiv", {
            configUrl : "../resources/autoconf.js",
            viewMode : "3d",
            layersOptions : {
                "ORTHOIMAGERY.ORTHOPHOTOS" : {
                },
                "ELEVATION.ELEVATIONGRIDCOVERAGE" : {
                    type : "elevation"
                }
            },
            center : {
                x : 2.357,
                y : 48.83
            },
            controlsOptions : {
                layerSwitcher : {
                    maximised : true
                }
            }
        });
```


##### Maintenant :

```javascript
        var map = Gp.Map.load("viewerDiv", {
            customConfigFile : "chemin/vers/ma/config/customConfig.json",
            viewMode : "3d",
            layersOptions : {
                "ORTHOIMAGERY.ORTHOPHOTOS" : {
                },
                "ELEVATION.ELEVATIONGRIDCOVERAGE" : {
                    type : "elevation"
                }
            },
            center : {
                x : 2.357,
                y : 48.83
            },
            controlsOptions : {
                layerSwitcher : {
                    maximised : true
                }
            }
        });
```

* [Removed]

    - appels au service d'autoconfiguration (#106)

    - **BC** : Les originators sont actuellement utilisés par les API par le contrôle d'attribution. Celui-ci va lire les originators des couches visibles et automatiquement les afficher dans l'encart dédié selon le paramétrage courant de la vue cartographique (zoom, emprise). Désormais, il faudra renseigner les originators manuellement lors de l'ajout de couches Géoportail. (#106)

```javascript
"TRANSPORTNETWORKS.RAILWAYS" : {
    originators: [{
        "name": "Nom raccourci originator",
        "attribution": "Titre complet originator",
        "url": "http://www.url-vers-le-site-du-producteur.fr",
        "constraints": [{
        "crs":"EPSG:4326",
        "bbox": {
            "left": -63.09696,
            "right": 55.826077,
            "top": 51.073032,
            "bottom": -21.385712
        },
        "minScaleDenominator": 0,
        "maxScaleDenominator": 559082265,
        "temporalExtent": ["2016-02-18","2016-02-18"]
        }]
    }]
}
```

    - **BC** : Les metadatas sont utilisées dans les API par le contrôle gestionnaire de couches (LayerSwitcher). Celui-ci va lire les metadatas des couches ajoutées à la carte et les afficher dans l'encart d'information dédié du LayerSwitcher. **Pour les couches WMTS uniquement**, désormais, pour que les metadatas apparaissent dans l'onglet "informations" du LayerSwitcher, il faudra les renseigner manuellement à la configuration de la couche Géoportail lors de son ajout à la carte. (#106)

```javascript
"ORTHOIMAGERY.ORTHOPHOTOS" : {
    metadata: [
        {
            format: "xml",
            url: "lien/Vers/Une/MetaDonnee.xml"
        },
        {
            format: "xml",
            url: "lien/Vers/Une/MetaDonnee.xml"
        }
    ]
}
```
