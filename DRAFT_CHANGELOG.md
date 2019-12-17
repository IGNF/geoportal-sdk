# SDK Geoportail 2D/3D, version 3.0.6

**17/12/2019 : version 3.0.6**
> Release SDK Geoportail 2D/3D

## Summary

* Correctifs divers (getFeatureInfo, switch 2D-3D...)

## Changelog

* [Added]
	- [SDK3D] couches mapbox en 3D avec parametre themes optionnels (pour portail)

* [Changed]
	- [dev-workflow] Mise à jour du package geoportal-extensions-openlayers en version 3.0.6

* [Fixed]
	- [SDK3D] fix interface avec listeners iTowns
	- [SDK3D] fix mauvais test "layer.type" qui cassait switch portail 
	- [SDK3D] setAutoCenter se declenche correctement meme si camera immobile
