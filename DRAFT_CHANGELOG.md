# SDK Geoportail 2D/3D, version 3.0.0

**01/03/2019 : version 3.0.0**
> Release SDK Geoportail 2D/3D

## Summary

* Migration d'OpenLayers en version 5.3.0
* Migration Itowns en version 2.8.0
* Nouvelle fonctionnalité avec l'import de couche au format *vecteur tuilé* (MapBox)
* Correctifs et amélioration suite au passage ES6
* Migration Webpack en version > 4.0.0

[semver] :
    - 2D : increment semver MAJOR version
    - 3D : increment semver MINOR version

## Changelog

* [Changed]

    - [dev-workflow] Mise à jour du package *geoportal-extensions-openlayers* en version 3.0.0
    - [dev-workflow] Mise à jour du package *geoportal-extensions-itowns* en version 2.2.0

* [Added]

    - Ajout du package *ol-mapbox-style* en version 4.2.1
    - Ajout de l'import de couche au format *vecteur tuilé* (MapBox)
    - Description de la variable globale **Gp** dans la jsdoc

* [Deprecated]

    - [dev-workflow] protocole HTTPS : ne plus executer les exemples sur un serveur en HTTP !

* [Removed]

* [Fixed]

    - [#32](https://github.com/IGNF/geoportal-sdk/issues/32) - Chemin par défaut de la librairie itowns embarquée dans le SDK
    - [#38](https://github.com/IGNF/geoportal-sdk/issues/38) - Encapsulation d'un composant dans une DIV utilisateur (option.div)

* [Security]

    - [dev-workflow] Mise à jour des dependances (faille de sécurité)
