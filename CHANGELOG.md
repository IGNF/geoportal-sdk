# CHANGELOG 2D/3D GEOPORTAL

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!-- toc -->

- [Release 3.0.3](#release-303)
- [Release 3.0.2](#release-302)
- [Release 3.0.1](#release-301)
- [Release 3.0.0](#release-300)
- [Release 2.0.2](#release-202)
- [Release 2.0.1](#release-201)
- [Release 2.0.0](#release-200)
- [Release 1.3.0](#release-130)
- [Release 1.2.0](#release-120)
- [Release 1.0.0](#release-100)

<!-- tocstop -->

---
# Release version 3.0.3

**18/11/2019 : version 3.0.3**
> Release SDK Geoportail 2D/3D

## Summary

* Correctif sur les projections (bug de proj4 qui ne gère pas les projections géocentriques)
* SDK 3D : correction d'un bug mineur sur la prise en compte du paramètre *projection*

## Changelog

* [Changed]

    - [dev-workflow] Mise à jour du package *geoportal-extensions-openlayers* en version 3.0.5

---
# Release 3.0.2

**21/10/2019 : version 3.0.2**
> Release SDK Geoportail 2D/3D

## Summary

* Mise à jour des packages extensions geoportail pour openlayers et itowns
* Mise à jour des README
* Corrections de bugs mineurs sur le SDK 3D

## Changelog

* [Changed]

    - [dev-workflow] Mise à jour du package *geoportal-extensions-openlayers* en version 3.0.4
    - [dev-workflow] Mise à jour du package *geoportal-extensions-itowns* en version 2.2.4
    - [dev-workflow] Mise à jour de la dépendance *threejs* en version 0.109 compatible avec itowns 2.15.3 embarqué par *geoportal-extensions-itowns* 2.2.4

* [Fixed]

    - [#41](https://github.com/IGNF/geoportal-sdk/issues/41) - Mise à jour README-SDK-2D
    - [#42](https://github.com/IGNF/geoportal-sdk/issues/42) - Mise à jour README-SDK-3D
    - Retrait de paramètres inutiles ajoutés aux couches de type "elevation" (SDK-3D)


---
# Release 3.0.1

**24/09/2019 : version 3.0.1**
> Release SDK Geoportail 2D/3D

## Summary

* Correctifs et amélioration suite au passage ES6
* [fix] ajout de KML/GPX/GeoJSON en 3D
* [fix] prise en compte du style pour couches WMTS/WMS en 3D

[semver] :
    - 2D : increment semver MINOR version
    - 3D : increment semver MINOR version

## Changelog

* [Changed]

    - [dev-workflow] Mise à jour du package *geoportal-extensions-openlayers* en version 3.0.3
    - [dev-workflow] Mise à jour du package *geoportal-extensions-itowns* en version 2.2.3

* [Fixed]

    - [#45](https://github.com/IGNF/geoportal-sdk/issues/45) - Dépendances manquantes ?

---
# Release 3.0.0

**06/09/2019 : version 3.0.0**

## Summary

* Migration d'OpenLayers en version 5.3.0
* Migration Itowns en version 2.13.1
* Nouvelle fonctionnalité avec l'import de couche au format *vecteur tuilé* (MapBox)
* Correctifs et amélioration suite au passage ES6
* Migration Webpack en version > 4.0.0

[semver] :
    - 2D : increment semver MAJOR version
    - 3D : increment semver MINOR version

## Changelog

* [Changed]

    - [dev-workflow] Mise à jour du package *geoportal-extensions-openlayers* en version 3.0.1
    - [dev-workflow] Mise à jour du package *geoportal-extensions-itowns* en version 2.2.1
    - [dev-workflow] Le moteur 3d d'itowns est intégré au bundle

* [Added]

    - Ajout du package *ol-mapbox-style* en version 4.2.1
    - Ajout de l'import de couche au format *vecteur tuilé* (MapBox)
    - Description de la variable globale **Gp** dans la jsdoc
    - Ajout des options natives pour le controle *Graticule* (ex. showLabels)

* [Deprecated]

    - [dev-workflow] protocole HTTPS : ne plus executer les exemples sur un serveur en HTTP !

* [Removed]

    - suppression des liens sur 'http://depot.ign.fr/' dans la jsdoc

* [Fixed]

    - [#32](https://github.com/IGNF/geoportal-sdk/issues/32) - Chemin par défaut de la librairie itowns embarquée dans le SDK
    - [#38](https://github.com/IGNF/geoportal-sdk/issues/38) - Encapsulation d'un composant dans une DIV utilisateur (option.div)

* [Security]

    - [dev-workflow] Mise à jour des dependances (faille de sécurité)

---
# Release 2.0.2

## Summary

**Version 2.0.2 des SDK 2D et 3D du Géoportail**

- mise à jour de la version des extensions Géoportail en dépendances (requêtes https par défaut) :
    * Extension Géoportail pour OpenLayers 2.1.2
    * Extension Géoportail pour iTowns 2.1.2

- Fix fonctions setXYcenter et setAutoCenter du SDK 3D :
    * ajout de la projection demandée au proj4 d'itowns à la volée

---
# Release 2.0.1

## Summary

**Version 2.0.1 du SDK Géoportail**

Publication du SDK-2D / SDK-3D :

- modification de la publication npm :
    * publications séparées des sdk 2d et 3d
    * publication sous forme de scoped packages dans le namespace \@ignf-geoportal

**Rappel des BREAKING CHANGES de la version 2.0.0**

- Les noms des bundles ont été modifiés :
        GpOl vers GpSDK2D
        GpOlItowns vers GpSDK3D

- Renommages divers :
      AHN vers SDK
      mix vers 3d
      ol vers 2d

- La méthode **IMap:getLib()** est remplacée par la méthode **IMap:getViewMode()**
        Modification des valeurs de retour:
        **library:ol3** est remplacée par **viewMode:2d**
        **library:itowns** est remplacée par **viewMode:3d**

- L'attribut **map.CLASSNAME** est déprécié et à remplacer par **map.getViewMode()**
        La valeur **CLASSNAME:OL3** correspond à **viewMode:2d**
        La valeur **CLASSNAME:IT**  correspond à **viewMode:3d**

- Le paramétrage de la fonction de chargement de la carte Gp.map.load() est modifié:
      Le paramètre **library** est remplacé par le paramètre **viewMode**
      La valeur du paramètre library **ol3** correspond à la valeur **2d** du paramètre viewMode
      La valeur du paramètre library **itowns** correspond à la valeur **3d** du paramètre viewMode

---
# Release 2.0.0

## Summary

**Version 2.0.0 du SDK Géoportail**

Publication du SDK-2D / SDK-3D :

- Migration du projet sous [Webpack](http://webpack.github.io/) ainsi que les sources en [ES6 modules](http://exploringjs.com/es6/ch_modules.html).
- Ajout de tests unitaires 2D et 3D
- Refactoring des Classes IMap, IT et OL

**BREAKING CHANGES**

- Les noms des bundles ont été modifiés :
        GpOl vers GpSDK2D
        GpOlItowns vers GpSDK3D

- Renommages divers :
        AHN vers SDK
        mix vers 3d
        ol vers 2d

- La méthode **IMap:getLib()** est remplacée par la méthode **IMap:getViewMode()**
        Modification des valeurs de retour:
        **library:ol3** est remplacée par **viewMode:2d**
        **library:itowns** est remplacée par **viewMode:3d**

- L'attribut **map.CLASSNAME** est déprécié et à remplacer par **map.getViewMode()**
        La valeur **CLASSNAME:OL3** correspond à **viewMode:2d**
        La valeur **CLASSNAME:IT** correspond à **viewMode:3d**

- Le paramétrage de la fonction de chargement de la carte Gp.map.load() est modifié:
        Le paramètre **library** est remplacé par le paramètre **viewMode**
        La valeur du paramètre library **ol3** correspond à la valeur **2d** du paramètre viewMode
        La valeur du paramètre library **itowns** correspond à la valeur **3d** du paramètre viewMode

---
# Release 1.3.0

## Summary

**Version 1.3.0 du SDK Géoportail**

Publication du SDK-2D / SDK-3D :

- *downgrade* de la version d'OpenLayers : 4.6.5 -> 4.2.0 :

- issue #34 (Modification spécification/implémentation du GeoJSON par OpenLayers sur les réponses WFS)
- issue #31 (Bouton de fermeture des popup)

---
# Release 1.2.0

## Summary

**Version 1.2.0 du SDK Géoportail**

## Publication du SDK-2D :

Ce SDK est une surcouche des librairies suivantes :
- [OpenLayers 4.6.5](http://openlayers.org/en/v4.6.5/apidoc/)
- [Geoportal extension for OpenLayers 3 - v2.0.0](http://ignf.github.io/geoportal-extensions/ol3-0.11.0/jsdoc/index.html)

## Publication du SDK-3D :  

Ce SDK est une surcouche des librairies suivantes :
- [OpenLayers 4.6.5](http://openlayers.org/en/v4.6.5/apidoc/)
- [Geoportal extension for OpenLayers 3 - v2.0.0](http://ignf.github.io/geoportal-extensions/ol3-0.11.0/jsdoc/index.html)
- [iTowns 2.3.0](http://www.itowns-project.org/itowns/API_Doc/)
- [Geoportal extension for iTowns - v2.0.0](http://ignf.github.io/geoportal-extensions/itowns-2.0.0/jsdoc/index.html)

Le SDK-3D Geoportail est une librairie javascript dont l'interface permet aux developpeurs web d'intégrer de manière simplifiée au sein d'une page web les données et les outils cartographiques du géoportail sur une carte 2D (basée sur OpenLayers), ou 3D (basée sur iTowns).

Les principales fonctionnalités disponibles sur une carte 3D sont les suivantes :
- Centrage et positionnement de la vue sur un globe 3D (centre, orientation, inclinaison, et zoom)
- Gestion de différentes couches de données cartographiques, dont les couches "MNT" (modèle numérique de terrain) de l'IGN, afin d'afficher le relief.
- Ajout d'outils à l'interface cartographique (echelle, minivue...)
- Fonction de bascule entre une vue 2D et 3D tout en conservant les paramètres courants de la carte (positionnement, couches de données, outils)

## Changelog

SDK-3D :

    Voir la [documentation du SDK](https://github.com/IGNF/geoportal-sdk#readme) et la [jsdoc](https://ignf.github.io/geoportal-sdk/latest/jsdoc/index.html)
    qui a été mise à jour en indiquant pour chaque fonctionnalité si
    celle-ci est disponible sur une carte 2D et/ou 3D.

---
# Release 1.0.0

## Summary

**Version 1.0 du SDK Géoportail**

* Utilisation d'**OpenLayers version 4.0** et de l'**extension Géoportail associée version 1.0**
* Gestion du clic sur les données (vecteur, WMS et WMTS) via un nouveau controle GetFeatureInfo
* Paramétrage des styles des couches vecteurs
* Publication du SDK dans les [dépots NPM](https://www.npmjs.com/package/geoportal-sdk)
* rotation possible de la carte
* possibilité d'affichage des couches raster en Noir-et-Blanc
* Option zoomToExtent pour les couches vecteur
* Degugs divers ...

## Changelog

[Full Changelog](https://github.com/IGNF/geoportal-sdk/compare/v1.0.0-beta.1...HEAD)

- ajout d'une couche avec position=0 : pas bien pris en compte avec la librairie OpenLayers [\#12](https://github.com/IGNF/geoportal-sdk/issues/12)
- Quelques PBs CSS sur les widgets du SDK [\#22](https://github.com/IGNF/geoportal-sdk/issues/22)
- Le paramètre gfiFormat n'est pas pris en compte [\#20](https://github.com/IGNF/geoportal-sdk/issues/20)
- Non affichage de la popup des markers [\#19](https://github.com/IGNF/geoportal-sdk/issues/19)
- Affichage des informations \(popup\) sur un 'feature' de type KML [\#8](https://github.com/IGNF/geoportal-sdk/issues/8)
- Affichage d'attributs non désirés dans les popups associées aux features [\#5](https://github.com/IGNF/geoportal-sdk/issues/5)
- Définir un style par défaut pour les couches vecteur \(KML, GPX, GeoJSON\) [\#3](https://github.com/IGNF/geoportal-sdk/issues/3)
- le paramétrage du parser KML OL3 empêche l'affichage des labels des ponctuels [\#2](https://github.com/IGNF/geoportal-sdk/issues/2)
- Adaptation SDK à la version 1.0 de l'extension pour OpenLayers [\#25](https://github.com/IGNF/geoportal-sdk/pull/25) ([gcebelieu](https://github.com/gcebelieu))
- Publication du SDK possible dans npm [\#24](https://github.com/IGNF/geoportal-sdk/pull/24) ([gcebelieu](https://github.com/gcebelieu))
- Upgrade ol3 gp plugins to new release 0.12.0 [\#18](https://github.com/IGNF/geoportal-sdk/pull/18) ([lboulanger](https://github.com/lboulanger))
- upgrade gp plugins \(bug fix IE11 in geoportal-access-lib\) [\#17](https://github.com/IGNF/geoportal-sdk/pull/17) ([lboulanger](https://github.com/lboulanger))
- Upgrade SDK MP\(editCoordinates\) + filter feature properties [\#16](https://github.com/IGNF/geoportal-sdk/pull/16) ([gcebelieu](https://github.com/gcebelieu))
- Mise en place d'une option de rotation de la carte [\#15](https://github.com/IGNF/geoportal-sdk/pull/15) ([lowzonenose](https://github.com/lowzonenose))
- Feature change layer color2 [\#14](https://github.com/IGNF/geoportal-sdk/pull/14) ([pjjmunier](https://github.com/pjjmunier))
- fix \#12 : prise en compte d'une position égale à zéro pour une couche OpenLayers [\#13](https://github.com/IGNF/geoportal-sdk/pull/13) ([lboulanger](https://github.com/lboulanger))
- Feature change layer color2 [\#11](https://github.com/IGNF/geoportal-sdk/pull/11) ([pjjmunier](https://github.com/pjjmunier))
- Mise en place de l'option 'zoomToExtent' pour les couches KML [\#10](https://github.com/IGNF/geoportal-sdk/pull/10) ([lowzonenose](https://github.com/lowzonenose))
- fix \#3 : Styling vector layers [\#9](https://github.com/IGNF/geoportal-sdk/pull/9) ([lboulanger](https://github.com/lboulanger))
- Review taskrunner [\#7](https://github.com/IGNF/geoportal-sdk/pull/7) ([lowzonenose](https://github.com/lowzonenose))
- Feature ol3 upgrade [\#6](https://github.com/IGNF/geoportal-sdk/pull/6) ([lboulanger](https://github.com/lboulanger))
- Feature control getfeatureinfo [\#4](https://github.com/IGNF/geoportal-sdk/pull/4) ([pjjmunier](https://github.com/pjjmunier))
- Feature wmts getfeatureinfo [\#1](https://github.com/IGNF/geoportal-sdk/pull/1) ([pjjmunier](https://github.com/pjjmunier))

---
