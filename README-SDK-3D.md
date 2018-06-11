# Kit de Développement (SDK) Géoportail - version 3D

Le Kit de Développement Géoportail dans sa version "SDK 3D" s’adresse à des gestionnaires de site internet désireux de proposer rapidement une cartographie dynamique en 2D et 3D utilisant les fonds IGN sur leur site et faisant appel à des fonctionnalités simples :

* positionnement de la carte ([centrage, orientation, niveau de zoom](#center))

* composition de la carte ([choix et assemblage du fond cartographique](#layers), [positionnement de repères visuels](#markers))

* mise à disposition [d’outils d’interaction avec la carte](#controls) aux internautes

* gestion de l’interaction de l’internaute avec la carte ([événements](#events))

## Mise en oeuvre

### Téléchargement

Vous pouvez récupérer le Kit de Développement Géoportail soit par [téléchargement direct](#download-direct), soit en utilisant le [gestionnaire de dépendances javascript NPM](#download-npm).


Il contient l'arborescence suivante :

    <Kit de Développement Géoportail>/
        GpSDK3D.js
            (version minifiée du code javascript pour une utilisation en production)
        GpSDK3D.css
            (version minifiée des css pour une utilisation en production)
        GpSDK3D-src.js
            (version non minifiée du code javascript pour une utilisation en développement)
        GpSDK3D-src.css
            (version non minifiée des css pour une utilisation en développement)
        itowns.js
            (version minifiée de la librairie iTowns compatible avec le SDK 3D)


<a id="download-direct"/>

#### Téléchargement direct

Vous pouvez télécharger la dernière version du Kit de Développement Géoportail directement sur [la page Github des releases du SDK](https://github.com/IGNF/geoportal-sdk/releases).

L'archive téléchargée (GpSDK.zip) comprend l'arborescence décrite ci-dessus.


<a id="download-npm"/>

#### Récupération avec NPM

Le Kit de Développement Géoportail est aussi disponible dans les dépôts [NPM](https://www.npmjs.com/package/geoportal-sdk).

Prérequis : [NodeJS](https://nodejs.org/en/) et [npm](https://www.npmjs.com/) installés.

```
npm i geoportal-sdk
```

L'arborescence décrite ci-dessus sera alors accessible dans le répertoire `node_modules/geoportal-sdk/dist/3d/` de votre projet.

#### Accès direct

Vous pouvez aussi choisir d'utiliser des fichiers hébergés en ligne, pour y accéder directement, lors de vos tests par exemple. Cependant, pour une utilisation en production, nous vous conseillons de télécharger ces fichiers et de les héberger vous-même, sur le même serveur qui héberge votre application.
Par exemple sur Github Pages :
```
http://ignf.github.io/geoportal-sdk/latest/dist/3d/GpSDK3D.js
http://ignf.github.io/geoportal-sdk/latest/dist/3d/GpSDK3D.css
http://ignf.github.io/geoportal-sdk/latest/dist/3d/GpSDK3D-src.js
http://ignf.github.io/geoportal-sdk/latest/dist/3d/GpSDK3D-src.css
```


### Intégration dans une page web

Placez les fichiers du SDK géoportail dans l'arborescence de votre serveur web. Vous pouvez positionner à votre guise les fichiers css et javascript. Le répertoire img doit cependant être positionné au même niveau que le fichier css pour que les ressources images qui y sont référencées soient correctement chargées.

Intégrez le SDK géoportail dans votre page web classiquement à l'aide d'une balise **script** pour charger le fichier javascript et d'une balise **link** pour charger le fichier css.

``` html
<!-- SDK Géoportail -->
<script src="chemin/vers/GpSDK3D.js"></script>
<link rel="stylesheet" href="chemin/vers/GpSDK3D.css" />
```


### Interfaces de programmation

Le chargement du SDK vous donne accès à son [interface de programmation](https://ignf.github.io/geoportal-sdk/latest/jsdoc/index.html) en plus des interfaces de programmation de [la bibliothèque d'accès](http://ignf.github.io/geoportal-access-lib/latest/jsdoc/index.html) ; d'[OpenLayers](https://openlayers.org/en/v4.0.1/apidoc/) et de son [extension géoportail dédiée](http://ignf.github.io/geoportal-extensions/current/jsdoc/openlayers/); d'[iTowns](https://www.itowns-project.org/itowns/API_Doc/) et de son [extension géoportail dédiée](http://ignf.github.io/geoportal-extensions/current/jsdoc/itowns/).



### Création et affichage d'une carte

La création et l'affichage d'une carte se fait à l'aide de la fonction [Gp.Map.load()](https://ignf.github.io/geoportal-sdk/latest/jsdoc/module-Map.html). Elle prend deux paramètres en entrée :

* l'identifiant du container HTML (typiquement un élément ```<div>```) dans lequel on veut qu'elle s'affiche.

* un objet javascript, de type [Gp.MapOptions](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.MapOptions.html) contenant le paramétrage de la carte.

Elle retourne un objet de type [Gp.Map](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.Map.html) avec lequel il sera ensuite possible [d'intéragir](#interact).


Exemple : le code suivant :

``` javascript
var map = Gp.Map.load(
    "mapDiv",   // identifiant du conteneur HTML
    // options d'affichage de la carte (Gp.MapOptions)
    {           
         // clef d'accès à la plateforme
         apiKey: "APIKEY",
         // chargement de la cartographie en 3D avec la librairie itowns
         library : "itowns",
         // centrage de la carte
         center : {
             location : "73 avenue de Paris, Saint-Mandé"
         },
         // niveau de zoom de la carte (de 1 à 21)
         zoom : 17,
         // Couches à afficher
         layersOptions : {
             "GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.STANDARD" : {
             }
         },
         // Outils additionnels à proposer sur la carte
         controlsOptions : {
             // ajout d'une barre de recherche
             "search" : {
                 maximised : true
             }
         }
    }    
) ;
```

Permet, d'afficher une carte avec les options suivantes :

* utilisation des **droits de la clef** 'APIKEY' ([Plus d'infos sur les possibilités de paramétrage des droits...](#config));

* **library** : "itowns" pour un chargement de la cartographie en 3D, ou "ol" (par défaut) pour un chargement de la cartographie en 2D. Il sera ensuite possible de basculer d'un mode de visualisation à l'autre ([Voir la partie "Bascule entre 2D et 3D](#switchToLib)).

* **centrage** sur l'adresse *"73 avenue de Paris, Saint-Mandé"* (en utilisant le service de géocodage du Géoportail) zoomée au niveau 17 ; ([Plus d'infos sur les possibilités de centrage...](#center))

* **fonds de carte** : ressource *Cartes SCAN Express Standard (GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.STANDARD*). [Plus d'infos sur le paramétrage des couches...](#layers);

* **outils additionnels** : barre de recherche (*controlsOptions*). [Plus d'infos sur le paramétrage des outils additionnels...](#controls) ;

**Voir l'exemple complet sur [jsFiddle](http://jsfiddle.net/ignfgeoportail/ck2pftgw/embedded/result,js,css,html/)**


<a id="config"/>

### Configuration de l'accès à la plateforme Géoportail

Le SDK Géoportail exploite les services web exposés par la plateforme Géoportail. Ceux-ci sont soumis à l'obtention d'une **clef d'accès** obtenue sur le site [professionnels.ign.fr](http://professionnels.ign.fr/ign/contrats) ayant les droits sur les ressources que vous souhaitez exploiter.


### Configuration dynamique

Une fois la clef obtenue, vous pouvez l'utiliser pour paramétrer le SDK à l'aide de la propriété **apiKey** lors de l'initialisation de la carte :


``` javascript
var map = Gp.Map.load(
    "mapDiv",   // identifiant du conteneur HTML
    // options d'affichage de la carte (Gp.MapOptions)
    {
         ...
         // clef d'accès à la plateforme
         apiKey: "APIKEY",
         ...
    }
) ;
```

Lors du chargement de la carte, le SDK récupèrera automatiquement la configuration associée à votre clef et s'en servira pour paramétrer la carte en fonction des droits disponibles.


### Optimisation du chargement : configuration locale

Vous pouvez améliorer le temps de chargement de votre page en mettant en cache sur votre plateforme la configuration associée à votre clef d'accès. Il vous suffit pour cela de récupérer le fichier de configuration (autoconf.json) obtenu à l'aide [du formulaire de ce tutoriel](http://ignf.github.io/geoportal-access-lib/latest/jsdoc/tutorial-optimize-getconfig.html).

Enregistrez ce fichier sur votre plateforme et paramétrez le SDK à l'aide de la propriété **configUrl** lors de l'initialisation de la carte :

``` javascript
var map = Gp.Map.load(
    "mapDiv",   // identifiant du conteneur HTML
    // options d'affichage de la carte (Gp.MapOptions)
    {
         ...
         // configuration de l'accès à la plateforme
         configUrl : "chemin/vers/autoconf.json",
         ...
    }
) ;
```


<a id="center"/>

### Configuration du centrage de la carte

Le paramétrage du cente de la carte se fait à l'aide de la propriété **[center](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.Center.html)** de l'objet [mapOptions](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.MapOptions.html).

On peut centrer la carte de différentes façons :

#### Centrage par coordonnées

On précise les coordonnées à l'aide des propriétés **x** et **y** en y associant l'identifiant de la projection dans laquelle elles sont exprimées à l'aide de la propriété **projection**. Par défaut, la projection utilisée est celle de la carte. En 3D, seul le système de coordonnées géographiques WGS84 (["EPSG:4326"](https://epsg.io/4326)) est utilisé.

**Exemple :**

``` javascript
var map = Gp.Map.load(
    "mapDiv",   // identifiant du conteneur HTML
    // options d'affichage de la carte (Gp.MapOptions)
    {
        // chargement de la cartographie en 3D avec la librairie itowns
         library : "itowns",
         // centrage de la carte
         center : {
             x : -4.620391,
             y : 48.268698,
             projection : "CRS:84"
         },
    }
) ;
```

Plus d'informations sur le paramétrage des projections [ici](#projections).


#### Centrage en utilisant le service de géocodage du Géoportail

La propriété **location** permet de préciser le lieu à géocoder et la propriété **locationType** permet de préciser le type de Géocodage à appliquer, selon la terminologie suivante (rendez vous [ici](https://geoservices.ign.fr/documentation/geoservices/geocodage.html) pour plus d'informations sur le service de Géocodage du Géoportail...) :

* "PositionOfInterest" : géocodage par noms de lieux

* "StreetAddress" : géocodage par adresses

* "CadastralParcels" : géocodage d'indentifants de parcelles cadastrales


**Exemple :**

``` javascript
var map = Gp.Map.load(
    "mapDiv",   // identifiant du conteneur HTML
    // options d'affichage de la carte (Gp.MapOptions)
    {
         // centrage de la carte
         center : {
             location : "73 avenue de Paris, Saint-Mandé",
             locationType : ["StreetAddress"]
         },
    }
) ;
```

*NB* : Cette possibilité de centrage ne fonctionne que si [la clef d'accès à la plateforme Géoportail utilisée pour paramétrer le SDK](#config) possède les droits nécessaires sur les ressources utilisées pour le Géocodage.


#### Centrage par géolocalisation du terminal utilisé

La propriété **geolocate**, si elle est positionée à **true**, permet de déclencher - sous réserve d'acceptation de l'internaute - une géolocalisation du terminal consultant la page et d'utiliser les coordonnées obtenues pour centrer la carte.

**Exemple :**

``` javascript
var map = Gp.Map.load(
    "mapDiv",   // identifiant du conteneur HTML
    // options d'affichage de la carte (Gp.MapOptions)
    {
        // chargement de la cartographie en 3D avec la librairie itowns
         library : "itowns",
         // centrage de la carte
         center : {
             geolocate : true
         },
    }
) ;
```

*NB* : on peut modifier le centre de la carte à tout moment après son chargement initial à l'aide de la méthode [setCenter()](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.Map.html#setCenter), de l'objet map retourné par la fonction Gp.map.load(). [Voir la partie "Interaction avec la carte"](#interact)


<a id="layers"/>

### Configuration des couches utilisées pour composer la carte

Le paramétrage des couches qui vont composer la carte se fait à l'aide de la propriété **layersOptions** de l'objet [mapOptions](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.MapOptions.html).

C'est un objet javascript dont chaque propriété va représenter une couche composant la carte : la clef est un identifiant associé à la couche ; la valeur un objet de type [Gp.LayerOptions](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.LayerOptions.html) permettant de préciser les caractéristiques de la couche à afficher.

Si cette propriété n'est pas renseignée, l'affichage se fera par défaut avec la couche des Photographies aériennes ("ORTHOIMAGERY.ORTHOPHOTOS") servie en images tuilées (WMTS) si la [clef d'accès utilisée pour initialiser la carte](#config) en possède les droits.

Selon le type de couches à afficher ("Géoportail" ou externe), le paramétrage varie.


#### Affichage des couches Géoportail WMS et WMTS

Les couches Géoportail sont les couches auxquelles donne droit [la clef utilisée pour paramétrer la carte](#config). Pour ajouter une telle couche à la carte, il suffit d'utiliser son nom technique comme clef de l'objet **layersOptions** et de passer comme valeur associée, un objet javascript de type [Gp.LayerOptions](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.LayerOptions.html) contenant, si besoin, des propriétés particulières ou vide si la configuration par défaut convient.

Pour afficher un MNT IGN dans un contexte 3D, il suffit de renseigner le paramètre "isElevation" à true.

**Exemple 1** : ajout des couches WMTS Photographies aériennes et cartes avec une opacité de 30%.

``` javascript
var map = Gp.Map.load(
    "mapDiv",   // identifiant du conteneur HTML
    // options d'affichage de la carte (Gp.MapOptions)
    {
         ...
         // Couches à afficher
         layersOptions : {
             // Couche photographies aériennes
             "ORTHOIMAGERY.ORTHOPHOTOS" : {},
             // Couche photographies aériennes
             "GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.STANDARD" : {
                 opacity : 0.3
             }
         }
         ...
    }    
) ;
```

**Voir l'exemple complet sur [jsFiddle](http://jsfiddle.net/ignfgeoportail/ewe0ms98/embedded/result,js,css,html/)**


**Exemple 2** : ajout de couches WMS INSPIRE servies par la plateforme Géoportail.

``` javascript
var map = Gp.Map.load(
    "map", // html div
    {
         ...
         layersOptions : {
             "OI.OrthoimageCoverage" : {},
             "BU.Building" : {}
         }
         ...
    }    
) ;
```

**Voir l'exemple complet sur [jsFiddle](http://jsfiddle.net/ignfgeoportail/w4Lfxmtv/embedded/result,js,css,html/)**

**Exemple 3** : ajout d'une couche WMTS d'élévation avec la couche WMTS Photographies aériennes

``` javascript
var map = Gp.Map.load(
    "mapDiv",   // identifiant du conteneur HTML
    // options d'affichage de la carte (Gp.MapOptions)
    {
         ...
         // Couches à afficher
         layersOptions : {
             // Couche photographies aériennes
             "ORTHOIMAGERY.ORTHOPHOTOS" : {},
             // Couche MNT IGN
             "ELEVATION.ELEVATIONGRIDCOVERAGE" : {
                 isElevation : true
             }
         }
         ...
    }    
) ;
```

**Voir l'exemple complet sur [jsFiddle](http://jsfiddle.net/ignfgeoportail/avb5c6ge/embedded/result,js,css,html/)**


#### Affichage des couches "externes"

Le couches externes sont des données issues d'autres serveurs que ceux de la plateforme Géoportail. Pour ajouter de telles couches à la carte, vous utilisez un identifiant de votre choix comme clef de l'objet **layersOptions** et passez comme valeur associée, un objet javascript de type [Gp.LayerOptions](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.LayerOptions.html) contenant le paramétrage nécessaire qui permettra au SDK d'afficher la couche.

Les formats supportés par le SDK pour les couches externes sont les suivants :

Pour les données images : WMS, WMTS (Open Street Map uniquement en 2D)

Pour les données vecteur : KML, GPX, GeoJSON (WFS uniquement en 2D)

Le type de couches à afficher, lorsqu'il ne s'agit pas d'une couche Géoportail, doit être passé via la propriété "format" de l'objet [Gp.LayerOptions](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.LayerOptions.html).


**Exemple** : ajout d'une couche WMS externe.


``` javascript
var map = Gp.Map.load(
    "map", // html div
    {
         ...
         layersOptions : {
             "ORTHOIMAGERY.ORTHOPHOTOS" : {},
             "ifremer-sables-languedoc" : {
                 title : "Sables Languedoc",
                 description :"IFREMER : Formations superficielles du précontinent Languedocien - Sable",
                 format : "WMS",
                 version : "1.3.0",
                 url : "http://www.ifremer.fr/services/wms/geosciences?",
                 layers : ["IFR_FACIESSABLE_GDL_1986_P"],
                 outputFormat : "image/png",
                 legends : [{
                     url : "http://www.ifremer.fr/services/wms/geosciences?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=IFR_FACIESSABLE_GDL_1986_P&format=image/png&STYLE=default",
                     format : "image/png"
                 }]
             }
         },
         ...
    }
) ;
```

**Voir l'exemple complet sur [jsFiddle](http://jsfiddle.net/ignfgeoportail/sbefqt0j/embedded/result,js,css,html/)**

*NB* : on peut ajouter, modifier ou retirer les couches de la carte à tout moment après son chargement initial à l'aide des méthodes [addLayers()](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.Map.html#addLayers), [modifyLayers()](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.Map.html#modifyLayers) ou [removeLayers()](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.Map.html#removeLayers) de l'objet map retourné par la fonction Gp.map.load(). [Voir la partie "Interaction avec la carte"](#interact)

<a id="markers"/>

### Configuration des markers - visu 2D uniquement

Le SDK 3D vous permet de rajouter des repères (markers) sur votre carte, **mais uniquement pour un affichage 2D**.
Cela se fait à l'aide de la propriété **markersOptions** de l'objet [mapOptions](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.MapOptions.html).

Il s'agit d'un tableau javascript contenant autant d'éléments que de markers à rajouter. Chaque élément est un objet javascript de type [Gp.MarkerOptions](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.MarkerOptions.html) ; il permet de préciser les caractéristiques (positionnement, apparence, ...) du repère de positionnement à afficher.

**Exemple** : Positionnement d'un marker au centre de la carte.

``` javascript
var map = Gp.Map.load(
    "mapDiv",   // identifiant du conteneur HTML
    // options d'affichage de la carte (Gp.MapOptions)
    {           
         ...
         // Repères visuels
         markersOptions : [{
             content : "<h1>Pôle Géosciences</h1><br/><p>73 avenue de Paris, Saint-Mandé</p><br/><p><a href='http://www.pôle-géosciences.fr/index.htm' target='_blank'>Site Web</a></p>"
         }],
         ...
    }    
) ;
```

**Voir l'exemple complet sur [jsFiddle](http://jsfiddle.net/ignfgeoportail/a9Lhp3tz/embedded/result,js,html,css/)**


<a id="controls"/>

### Configuration des outils additionnels à proposer sur la carte

Par défaut, la carte se présente :
- en 2D avec les boutons de zoom et l'affichage des attributions.
- en 3D avec l'affichage des attributions.
Le SDK 3D vous permet de rajouter des outils sur la carte qui vont permettre à l'internaute d'interagir avec la celle-ci. **Attention :** certains de ces outils ne sont disponibles que sur la visualisation 2D.

L'ajout d'outils se fait à l'aide de la propriété **controlsOptions** de l'objet [mapOptions](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.MapOptions.html). Il s'agit d'un objet javascript dont chaque propriété a le nom de l'outil à rajouter et chaque valeur de propriété permet de préciser - si besoin - le paramétrage de l'outil. Ce paramétrage se fait à l'aide d'un objet javascript de type [Gp.ControlOptions](//ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.ControlOptions.html), dont les propriétés vont varier selon l'outil.

Les outils disponibles en 2D et 3D sont les suivants :

* gestionnaire de couches (["layerswitcher"](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.ControlOptions.html#layerswitcher))

* affichage des producteurs de données (["attributions"](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.ControlOptions.html#attributions))

* mini vue (["overview"](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.ControlOptions.html#overview)) ;

* échelle graphique (["graphicscale"](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.ControlOptions.html#graphicscale)) ;

* coordonnées de la souris (["mouseposition"](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.ControlOptions.html#mouseposition))


Les outils disponibles en 2D uniquement sont les suivants :

* boutons de zoom (["zoom"](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.ControlOptions.html#zoom)) ;

* barre de recherche (["search"](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.ControlOptions.html#searchctrl))

* recherche inversée (["reversesearch"](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.ControlOptions.html#reversesearch))

* outils de dessin (["drawing"](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.ControlOptions.html#drawing))

* bouton d'orientation (["orientation"](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.ControlOptions.html#orientation)) ;

* calcul d'isochrones (["isocurve"](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.ControlOptions.html#isocurve))

* affichage d'une grille (["graticule"](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.ControlOptions.html#graticule))

* import de couches (["layerimport"](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.ControlOptions.html#layerimport))

* calcul de distances (["length"](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.ControlOptions.html#length))

* calcul de surfaces (["area"](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.ControlOptions.html#area))

* calcul d'azimuth (["azimuth"](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.ControlOptions.html#azimuth))

* calcul de profil altimétrique (["elevationpath"](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.ControlOptions.html#elevationpath))

*NB* : on peut ajouter, modifier ou retirer les outils de la carte à tout moment après son chargement initial à l'aide des méthodes [addControls()](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.Map.html#addControls), [modifyControls()](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.Map.html#modifyControls) ou [removeControls()](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.Map.html#removeControls) de l'objet map retourné par la fonction Gp.map.load(). [Voir la partie "Interaction avec la carte"](#interact)

<a id="switch_tools"/>

*NB* : lors d'une [bascule d'une visualisation 2D vers 3D](#switchToLib) à l'aide de la fonction [switch2D3D()](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.Map.html#switch2D3D) , les outils non disponibles en 3D disparaitront de l'interface cartographique. Ils réapparaitront en cas de nouvelle bascule d'une visualisation 3D vers 2D.


<a id="events"/>

### Abonnement aux intéractions des utilisateurs avec la carte

Le SDK permet d'écouter certains événements qui se produisent lorsque les internautes intéragissent avec la carte et de définir des comportements à appliquer lorsque ces événements se produisent.

Cela se fait à l'aide de la propriété **mapEventsOptions** de l'objet [mapOptions](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.MapOptions.html).

Il s'agit d'un objet javascript dont les propriétés ont le nom de l'événement auquel on souhaite s'abonner et les valeurs associées sont des fonctions javascript à déclencher lorsque l'événement se produit. Chaque fonction prend comme paramètre un objet javascript représentant l'événement et ses propriétés qui vient de se produire.

Les événements auxquels on peut s'abonner sont les suivants :

* Evénements d'initialisation : "mapLoaded", "geolocated", "located", "configured"

* Evénements de changement d'état de la carte : "centerChanged", "zoomChanged" ,"azimuthChanged", "layerChanged", "tiltChanged"


**Exemple** : Déclenchement d'une alerte à la fin de l'initialisation de la carte.

``` javascript
var map = Gp.Map.load(
    "mapDiv",   // identifiant du conteneur HTML
    // options d'affichage de la carte (Gp.MapOptions)
    {           
         ...
         mapEventsOptions : {
             // when map has finished to initialize and to render
             "mapLoaded" : function(evt) {
                 alert("map ready !") ;
             }
         }
         ...
    }    
) ;
```

**Voir l'exemple complet sur [jsFiddle](http://jsfiddle.net/ignfgeoportail/9fmLyhLL/embedded/result,js,html,css/)**


*NB* : on peut s'abonner aux événements à tout moment après le chargement initial de la carte à l'aide de la méthode [listen()](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.Map.html#listen) de l'objet map retourné par la fonction Gp.map.load(). [Voir la partie "Interaction avec la carte"](#interact)

<a id="switchToLib"/>

### Bascule entre 2D et 3D

Le SDK 3D permet de basculer d'une vue 2D à une vue 3D, et vice-versa. Pour cela, utiliser la fonction [Gp.Map.switch2D3D()](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.Map.html#switch2D3D). Les couches, la position de la caméra, et les outils présents sur l'interface cartographique sont conservés lors de la bascule (hormis les outils disponibles qu'en 2D, [plus d'infos](#switch_tools)).

**Voir un exemple de bascule sur [jsFiddle](http://jsfiddle.net/ignfgeoportail/fsgxk3ov/embedded/result,js,html,css/)**

<a id="others"/>

### Autres possibilités de paramétrage

L'objet [Gp.MapOptions](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.MapOptions.html) permet de jouer sur d'autres paramètres de la carte lors de son initialisation avec la fonction [Gp.Map.load()](https://ignf.github.io/geoportal-sdk/latest/jsdoc/module-Map.html). Entre autres :

* la projection

* les niveaux de zoom courant, minimal et maximal

* l'orientation (azimuth) de la carte

* l'inclinaison (tilt) de la vue en 3D

* ...

<!--
<a id="projections"/>

### Gestion des projections
-->

<a id="interact">

### Interaction avec la carte créée

La fonction [Gp.Map.load()](https://ignf.github.io/geoportal-sdk/latest/jsdoc/module-Map.html) retourne un objet de type [Gp.Map](https://ignf.github.io/geoportal-sdk/latest/jsdoc/Gp.Map.html) avec lequel il sera possible d'interagir programmatiquement **à partir du moment où l'événement "mapLoaded" sera émis**.

Pour un bon fonctionnement, il faut donc conditionner les traitements ultérieurs au chargement de la carte à la réception de cet événement à l'aide de la propriété mapEventsOptions [comme décrit précédemment](#events). Un script javascript utilisant le SDK Géoportail aura donc l'allure générale suivante :

``` javascript

var map = null ;

function afterInitMap() {
    // le code de l'application interagissant avec la carte
    // ici, l'objet map est initialisé.
    ...
}

// Chargement de la carte et initialisation de l'objet Map
map = Gp.Map.load(
    "mapDiv",   // identifiant du conteneur HTML
    // options d'affichage de la carte (Gp.MapOptions)
    {
         apiKeys : "API-KEY",
         ...
         mapEventsOptions : {
             // Appel de la fonction après le chargement de la carte
             "mapLoaded" : afterInitMap
         }
         ...
    }    
) ;
```
