# SDK Geoportail 2D/3D, version 3.0.8

**06/03/2020 : version 3.0.8**
> Release SDK Geoportail 2D/3D

## Summary

Modifications sur la gestion de polyfill pour meilleure compatibilité avec IE10/11 et corrections diverses sur l'interface cartographique pour meilleure gestion de l'affichage des couches mapBox.

## Changelog

* [Added]


* [Changed]

    - [SDK3D] - iTowns 2.19, GpExtItowns 2.2.7, threejs 0.113.2

* [Removed]

    - [SDK2D/3D] suppression des polyfill sur la compatibilité IE10/11
    - [SDK2D/3D] suppression de la variable globale : olms

* [Fixed]

    - [SDK2D] meilleure gestion des couches mapbox
    - [SDK3D] correction du switch 3D->2D avec couches mapbox
    - [SDK3D] correction de l'affichage de la configuration des couches mapBox dans le layerSwitcher en 3D

* [Deprecated]

* [Security]
