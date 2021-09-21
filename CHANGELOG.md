# CHANGELOG 2D/3D GEOPORTAL

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!-- toc -->

- [Release 3.1.5](#release-315)
  * [Summary](#summary)
  * [Changelog](#changelog)
- [Release 3.1.4](#release-314)
  * [Summary](#summary-1)
  * [Changelog](#changelog-1)
- [Release 3.1.3](#release-313)
  * [Summary](#summary-2)
  * [Changelog](#changelog-2)
- [Release 3.1.2](#release-312)
  * [Summary](#summary-3)
  * [Changelog](#changelog-3)
- [Release 3.1.1](#release-311)
  * [Summary](#summary-4)
  * [Changelog](#changelog-4)
- [Release 3.1.0](#release-310)
  * [Summary](#summary-5)
  * [Changelog](#changelog-5)
- [Release 3.0.15](#release-3015)
  * [Summary](#summary-6)
  * [Changelog](#changelog-6)
- [Release 3.0.14](#release-3014)
  * [Summary](#summary-7)
  * [Changelog](#changelog-7)
- [Release 3.0.13](#release-3013)
  * [Summary](#summary-8)
  * [Changelog](#changelog-8)
- [Release 3.0.12](#release-3012)
  * [Summary](#summary-9)
  * [Changelog](#changelog-9)
- [Release 3.0.11](#release-3011)
  * [Summary](#summary-10)
  * [Changelog](#changelog-10)
- [Release 3.0.10](#release-3010)
  * [Summary](#summary-11)
  * [Changelog](#changelog-11)
- [Release 3.0.9](#release-309)
  * [Summary](#summary-12)
  * [Changelog](#changelog-12)
- [Release 3.0.8](#release-308)
  * [Summary](#summary-13)
  * [Changelog](#changelog-13)
- [Release 3.0.7](#release-307)
  * [Summary](#summary-14)
  * [Changelog](#changelog-14)
- [Release 3.0.6](#release-306)
  * [Summary](#summary-15)
  * [Changelog](#changelog-15)
- [Release 3.0.5](#release-305)
  * [Summary](#summary-16)
  * [Changelog](#changelog-16)
- [Release 3.0.4](#release-304)
  * [Summary](#summary-17)
  * [Changelog](#changelog-17)
- [Release 3.0.3](#release-303)
  * [Summary](#summary-18)
  * [Changelog](#changelog-18)
- [Release 3.0.2](#release-302)
  * [Summary](#summary-19)
  * [Changelog](#changelog-19)
- [Release 3.0.1](#release-301)
  * [Summary](#summary-20)
  * [Changelog](#changelog-20)
- [Release 3.0.0](#release-300)
  * [Summary](#summary-21)
  * [Changelog](#changelog-21)
- [Release 2.0.2](#release-202)
  * [Summary](#summary-22)
- [Release 2.0.1](#release-201)
  * [Summary](#summary-23)
- [Release 2.0.0](#release-200)
  * [Summary](#summary-24)
- [Release 1.3.0](#release-130)
  * [Summary](#summary-25)
- [Release 1.2.0](#release-120)
  * [Summary](#summary-26)
  * [Publication du SDK-2D :](#publication-du-sdk-2d-)
  * [Publication du SDK-3D :](#publication-du-sdk-3d-)
  * [Changelog](#changelog-22)
- [Release 1.0.0](#release-100)
  * [Summary](#summary-27)
  * [Changelog](#changelog-23)

<!-- tocstop -->

---
# Release 3.1.5

**07/04/2021 : version 3.1.5**
> Release SDK Geoportail 2D/3D

## Summary

* Upgrade itowns et extension geoportail associée
 
## Changelog

* [Added]

* [Changed]
    
    - upgrade ext-gp-itowns-2.3.2 et versions fixes pour proj4 et threejs (https://github.com/IGNF/geoportal-sdk/pull/78)
    - mise à jour documentation SearchEngine pour être cohérent avec release extensions geoportail pour ol v3.0.14 (https://github.com/IGNF/geoportal-sdk/pull/74)

* [Removed]

* [Fixed]

    - fix des erreurs remontées par deepscan (https://github.com/IGNF/geoportal-sdk/pull/75)
    - fix sur les listeners (https://github.com/IGNF/geoportal-sdk/pull/77)
    - fix sur l'affichage des labels des couches vecteur tuilé en 3D (https://github.com/IGNF/geoportal-sdk/pull/76)
    - correction des exemples 2d sur les projections (https://github.com/IGNF/geoportal-sdk/commit/5ab59bb3136c7503b7aac992698df393c2bc6883)
  
* [Deprecated]

* [Security]

---
# Release 3.1.4

**15/02/2021 : version 3.1.4**
> Release SDK Geoportail 2D/3D

## Summary

* Upgrade des extensions geoportail sous-jacentes
 
## Changelog

* [Added]

* [Changed]
    
    - upgrade ext-gp-itowns-2.3.1 (https://github.com/IGNF/geoportal-sdk/commit/c71476f5cbde52490a55bf12a50b66d304473e8b)
    - upgrade ext-gp-ol v3.0.14 (https://github.com/IGNF/geoportal-sdk/commit/c71476f5cbde52490a55bf12a50b66d304473e8b)
    - mise à jour documentation SearchEngine pour être cohérent avec release extensions geoportail pour ol v3.0.14 (https://github.com/IGNF/geoportal-sdk/pull/74)

* [Removed]

* [Fixed]
  
* [Deprecated]

* [Security]

---
# Release 3.1.3

**16/12/2020 : version 3.1.3**
> Release SDK Geoportail 2D/3D

## Summary

* Corrections mineures
 
## Changelog

* [Added]

* [Changed]

* [Removed]

* [Fixed]
  
    - correction des tests
    - correction chargement par défaut couche orthophotos en 3D

* [Deprecated]

* [Security]

---
# Release 3.1.2

**11/12/2020 : version 3.1.2**
> Release SDK Geoportail 2D/3D

## Summary

* Changements internes et mise à jour de la documentation
 
## Changelog

* [Added]

* [Changed]

    - mise à jour documentation
    - changements internes du processus de build (b9564b912049dbade1a3f9548a67e2bf374471e1) 

* [Removed]

* [Fixed]

* [Deprecated]

* [Security]

---
# Release 3.1.1

**08/12/2020 : version 3.1.1**
> Release SDK Geoportail 2D/3D

## Summary

* Correction urgente sur le chargement d'une carte avec autoconf distante
 
## Changelog

* [Added]

* [Changed]

* [Removed]

* [Fixed]

    - Correction sur le chargement de couches via apiKey (9b09a2bfcc40894b09fa86fcb47fe022f20723a6)

* [Deprecated]

* [Security]

---
# Release 3.1.0

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

---
# Release 3.0.15

**30/09/2020 : version 3.0.15**
> Release SDK Geoportail 2D/3D

## Summary

Correctif sur la gestion des couches vecteur tuilé

## Changelog

* [Added]

    - Ajout d'une option pour afficher les labels associés à une couche vecteur tuilé en 3D (#67)

* [Changed]
    
    - layerChanged écoute la propriété mapbox-status (#66)

* [Removed]

* [Fixed]

    - correction du centrage par localisation (#63)

* [Deprecated]

* [Security]

---
# Release 3.0.14

**16/07/2020 : version 3.0.14**
> Release SDK Geoportail 2D/3D

## Summary

Mise à jour des dépendances majeures du SDK, et correctifs divers sur le vecteur tuilé et la visu 3D

## Changelog

* [Added]

* [Changed]
    
    - mise à jour ext-ol-3.0.12
    - mise à jour ext-itowns-2.2.12
    - mise à jour des dépendances

* [Removed]

* [Fixed]

    - meilleur gestion des options de la couche sur le format MapBox (702576386838dc893346e806fdb36362a129ae5c)
    - fix de la fonction de récupération des controls itowns (6dae22f0de5cdaba0d18671caef9c3a8c437f645)
    - fix du switch 3D->2D avec extent non définie (0d2df3a615e3af3a34bd6cbebe25fabc83993a24)
    - autorisation des callbacks anonymes (37bc34b395ff365559976ab4a22fe88fa3aa99d1)
    - ajout d'un id au canvas d'itowns (90b9dfd56c1f4b14cf96923be6eebd3c664df26a)
* [Deprecated]

* [Security]

---
# Release 3.0.13

**02/07/2020 : version 3.0.13**
> Release SDK Geoportail 2D/3D

## Summary

Correctifs divers et ajouts

## Changelog

* [Added]

	- Ajout de l'option extent au chargement de la carte (#57)
	- Ajout guide de bonnes pratiques de developpement (84047c80a45333a692e6f28fc7bc4a7c56d233d6)
	- Ajout du control d'exageration du relief (#59)
	- Évolution sur le VectorTile 2D (mapbox) (#58) :
		- Ajout d'un exemple d’implémentation de menu
			- des thèmes,
			- des filtres,
			- de la légende
		- Ajout des événements sur les changements sur les "properties"

* [Changed]

	- Mise à jour de l'extension géoportail pour openlayers en version 3.0.11
	- Mise à jour de l'extension géoportail pour itowns en version 2.2.10

* [Fixed]

	- fix fonctionnalité noir et blanc avec Chrome v83+ (892c55bee89a2cac9448e28d80cc19ddb9617cdb)
	- fix sur la gestion des événements (#56)
	- fix la gestion des filtres attributaires sur le VectorTile 2D (mapbox)"

---
# Release 3.0.12

**23/04/2020 : version 3.0.12**
> Release SDK Geoportail 2D/3D

## Summary

Correctifs divers et mises à jour des tests et du processus de build.

## Changelog

* [Changed]

    - utilisation des sources ES6 d'itowns pour la construction du bundle 3D (#54)

* [Fixed]

    - mise à jour et corrections des tests unitaires
    - mise à jour de la documentation pour l'ajout de couches mapBox (#55)
    - fix sur les interactions du control de getFeatureInfo
    - fix sur la mise à jour du statut des styles mapbox

---
# Release 3.0.11

**02/04/2020 : version 3.0.11**
> Release SDK Geoportail 2D/3D

## Summary

Mise à jour des librairies sous-jacentes et corrections sur le controle d'edition des styles mapbox.

## Changelog

* [Changed]

    - mise à jour de l'extension géoportail pour openlayers en version 3.0.10
    - mise à jour de l'extension géoportail pour itowns en version 2.2.9
    - mise à jour de la dépendance ol-mapbox-style en version 4.2.1

* [Fixed]

    - fix sur le widget editor

---
# Release 3.0.10

**01/04/2020 : version 3.0.10**
> Release SDK Geoportail 2D/3D

## Summary

Hotfix sur la gestion des sprites des couches mapbox et sur l'editeur de couches mapbox

## Changelog

* [Changed]

    - mise à jour de l'extensions géoporatil pour openlayers en version 3.0.9

---
# Release 3.0.9

**31/03/2020 : version 3.0.9**
> Release SDK Geoportail 2D/3D

## Summary

Amelioration des outils de deboggage et de contribution
Correction mineure sur le vecteur tuilé

## Changelog

* [Added]

    - [SDK2D/3D] Ajout des infos détaillées de build dans les bundles SDK
    - [github] Ajout de templates pour PR et issues

* [Changed]
    - [SDK3D] Mise à jour de geoportal-extensions-itowns en version 2.2.8
    - [SDK2D/3D] Mise à jour de geoportal-extensions-openlayers en version 3.0.8

* [Fixed]

    - [SDK3D] Correction de l'ajout des couches mapBox en 3D qui n'ont pas de propriétés de styles annexes
    - [SDK2D/3D] Corrections sur la gestion de cartes multiples au sein d'une même page (et adaptation exemples)
    - [SDK2D/3D] Forcage de la version de mapbox-gl-style-spec (cf https://github.com/openlayers/ol-mapbox-style/issues/261)
    - [SDK2D/3D] Mise à jour du plugin "terser-webpack-plugin"

---
# Release 3.0.8

**06/03/2020 : version 3.0.8**
> Release SDK Geoportail 2D/3D

## Summary

Modifications sur la gestion des polyfills pour une meilleure compatibilité avec IE10/11 et corrections diverses sur l'interface cartographique pour meilleure gestion de l'affichage des couches mapBox.

## Changelog

* [Changed]

    - [SDK3D] - iTowns 2.19, GpExtItowns 2.2.7, threejs 0.113.2

* [Removed]

    - [SDK2D/3D] suppression des polyfill sur la compatibilité IE10/11
    - [SDK2D/3D] suppression de la variable globale : olms

* [Fixed]

    - [SDK2D] meilleure gestion des couches mapbox
    - [SDK3D] correction du switch 3D->2D avec couches mapbox
    - [SDK3D] correction de l'affichage de la configuration des couches mapBox dans le layerSwitcher en 3D"

---
# Release 3.0.7

**04/02/2020 : version 3.0.7**
> Release SDK Geoportail 2D/3D

## Summary

Meilleure gestion des options pour les couches mapBox, fix de compatibilité avec internet explorer, et mise à jour d'iTowns en version 2.17

## Changelog

* [Changed]

    - [SDK2D/3D] modification des options et de l'interface pour les couches mapbox
    - [SDK2D/3D] modifications des options pour la gestion des filtres pour les couches mapbox
    - [SDK3D] iTowns v2.17
    - [SDK3D] adaptation/simplification centrage 3D

* [Fixed]

    - [SDK2D/3D] meilleure gestion de la compatibilité IE10/11 (polyfill)
    - [SDK3D] meilleure gestion des paramètres pour les couches mapbox en 3D
    - [SDK2D/3D] correctif d'une exception sur la fonction de geolocalisation

---
# Release 3.0.6

**17/12/2019 : version 3.0.6**
> Release SDK Geoportail 2D/3D

## Summary

* Correctifs divers (getFeatureInfo, switch 2D-3D...)

## Changelog

* [Added]
	- [SDK3D] couches mapbox en 3D avec paramètre themes "optionnels" (pour portail)

* [Changed]
	- [dev-workflow] Mise à jour du package geoportal-extensions-openlayers en version 3.0.6

* [Fixed]
	- [SDK3D] fix interface du SDK avec celle des listeners de l'API iTowns
	- [SDK3D] fix divers sur l'ajout de couches en 3D
	- [SDK3D] fix de la fonction setAutoCenter qui ne se declenchait pas correctement

---
# Release 3.0.5

**06/12/2019 : version 3.0.5**
> Release SDK Geoportail 2D/3D

## Summary

* Première gestion du vecteur tuilé en 3D

## Changelog

* [Added]
    - [SDK2D] gestion de l'option "grayScaled" sur le vecteur tuilé
    - [SDK3D] ajout possible des couches vecteur tuilé simples via le SDK 3D

* [Changed]
    - [SDK3D] adaptation du switch 2D<->3D pour conservation des couches vecteur tuilé
    - [SDK3D] intégration des extensions Géoportail pour iTowns en version 2.2.5
    - [SDK3D] intégration d'iTowns en version 2.16.0

* [Fixed]
    - [SDK2D] Correctifs divers sur le vecteur tuilé 2D
    - [SDK3D] fix divers sur l'ajout des couches en 3D (mauvaises bbox, paramètres inutilisés...)

---
# Release 3.0.4

**21/11/2019 : version 3.0.4**
> Release SDK Geoportail 2D/3D

## Summary

* Correctif pour l'ajout de couches WMS en 3D
* Correctif pour la gestion des styles KML en 3D
* Mise à jour de la documentation pour les styles (2D et 3D)

## Changelog

* [Fixed]

    - Ajout de couches WMS en 3D : correction de la BBOX par défaut
    - Ajout de couches KML en 3D : correction du style par défaut

* [Changed]

    - Mise à jour de la documentation pour les styles (2D et 3D)

---
# Release 3.0.3

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
