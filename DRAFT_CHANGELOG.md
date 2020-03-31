# SDK Geoportail 2D/3D, version 3.0.9

**31/03/2020 : version 3.0.9**
> Release SDK Geoportail 2D/3D

## Summary

Amelioration des outils de deboggage et de contribution
Correction mineure sur le vecteur tuilé

## Changelog

* [Added]

- Ajout des infos détaillées de build dans les bundles SDK
- Ajout de templates pour PR et issues

* [Changed]
- Mise à jour de geoportal-extensions-itowns en version 2.2.8
- Mise à jour de geoportal-extensions-openlayers en version 3.0.8

* [Removed]

* [Fixed]

- Correction de l'ajout des couches mapBox en 3D qui n'ont pas de propriétés de styles annexes
- Corrections sur la gestion de cartes multiples au sein d'une même page (et adaptation exemples)
- Forcage de la version de mapbox-gl-style-spec (cf https://github.com/openlayers/ol-mapbox-style/issues/261)
- Mise à jour du plugin "terser-webpack-plugin"

* [Deprecated]

* [Security]
