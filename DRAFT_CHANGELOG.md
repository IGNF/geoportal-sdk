# SDK Geoportail 2D/3D, version 3.1.0

**03/12/2020 : version 3.1.0**
> Release SDK Geoportail 2D/3D

## Summary

* iTowns 2.27.0, webGL2 et correctifs divers
* Possibilité d'utiliser le SDK sans appel au service d'autoconfiguration
* BREAKING CHANGE : SDK 3D compatible avec extensions geoportail pour itowns 2.3.0 + Utilisation du webGl2 par défaut
 
## Changelog

* [Added]

    - Ajout de fonctions de manipulation des overlays/markers (#69)
    - Interface pour l'option sprite en 3D (#71)
    - Ajout de l'option "reloadConfig" afin d'avoir le choix de charger le service d'autoconfiguration (#73)

* [Changed]

    - MaJ iTowns 2.27.0 et reactivation affichage labels vecteur tuilé par défaut + paramètre sur l'utilisation du webGL2 (#72)
    - Possibilité de configurer le contrôle "overview" sans appel au service d'autoconfiguration (#73)
    
* [Removed]

* [Fixed]

    - Affichage des ponctuels GeoJSON en 3D (#70)
    - Eslint style fixes (#73)

* [Deprecated]

* [Security]
