# Bibliothèque d'accès aux ressources du Géoportail

[![Build Status](https://travis-ci.org/IGNF/geoportal-access-lib.png?branch=master)](https://travis-ci.org/IGNF/geoportal-access-lib)
[![GitHub release](https://img.shields.io/github/release/IGNF/geoportal-access-lib.svg)](https://github.com/IGNF/geoportal-access-lib)

La bibliothèque d’accès aux ressources de la plateforme Géoportail est une bibliothèque de fonctions javascript permettant d'accéder aux ressources délivrées par les services web du Géoportail.

Elle permet plus particulièrement d'effectuer les opérations suivantes utilisant les données de l'IGN :

* [Géocoder des adresses, toponymes et parcelles cadastrales](#geocode)

* [Obtenir des suggestions d'adresses ou de toponymes à partir de textes incomplets](#autocomplete)

* [Obtenir des localisants (toponymes, adresses, parcelles cadastrales) proche d'une position donnée (géocodage inverse)](#reverseGeocode)

* [Obtenir des altitudes en un ou plusieurs points ou calculer des profils altimétriques](#alti)

* [Calculer un itinéraire piéton ou routier](#route)

* [Calculer des isochrones / isodistances autour d'un point](#isoCurve)

* [Obtenir des informations relatives à un contrat d'accès au Géoportail](#getConfig)


## Mise en oeuvre

Vous pouvez récupérer la bibliothèque d'accès soit en la [téléchargeant directement](#t%C3%A9l%C3%A9chargement-direct), soit en utilisant le [gestionnaire de dépendances javascript NPM](#r%C3%A9cup%C3%A9ration-avec-npm).

### Téléchargement direct

Vous pouvez récupérer ici la version compilée et autonome de la bibliothèque d'accès : [GpServices.js](https://github.com/IGNF/geoportal-access-lib/releases/latest), dans la partie "Downloads".


### Récupération avec NPM

La bibliothèque d'accès est aussi disponible dans les dépôts [NPM](https://www.npmjs.com/package/geoportal-access-lib).

Prérequis : [NodeJS](https://nodejs.org/en/) et [npm](https://www.npmjs.com/) installés.

```
npm install geoportal-access-lib
```

#### Accès direct

Vous pouvez aussi choisir d'utiliser des fichiers hébergés en ligne, pour y accéder directement, lors de vos tests par exemple. Cependant, pour une utilisation en production, nous vous conseillons de télécharger ces fichiers et de les héberger vous-même, sur le même serveur qui héberge votre application.

Par exemple sur Github Pages :

```
https://ignf.github.io/geoportal-access-lib/latest/dist/GpServices.js
https://ignf.github.io/geoportal-access-lib/latest/dist/GpServices-src.js
```

### Intégration dans une page web

Intégrez la bibliothèque d'accès dans votre page WEB classiquement à l'aide d'une balise **script**.

``` html
<script src="chemin/vers/GpServices.js"></script>
```

### Intégration dans [NodeJS](https://nodejs.org/en/)

Intégrez la bibliothèque d'accès dans votre script à l'aide de la fonction **require**.

``` js
var Gp = require("chemin/vers/GpServices.js");
```

> **Note :**
Par défaut, les services sont intérrogés en HTTP. On a la possibilité de forcer le HTTPS avec l'option **ssl**. Ce comportement est ignoré dans les environnements clients (navigateur). Les services sont alors interrogés suivant le même protocole que la page en cours.

``` js
var Gp = require("chemin/vers/GpServices.js");

Gp.Services.geocode({
    apiKey : "...",
    ssl : true,
    location : "...",
    onSuccess : function (result) {
        ...
    }
});
// --> https://wxs.ign.fr/KEY/geoportail/ols?
```

> **Note :**
Dans un environnement **NodeJS**, il faut installer les 2 dépendances suivantes dans votre projet :
- xmldom
- request

### Intégration dans un module ES6

Intégrez la bibliothèque d'accès dans votre page WEB à l'aide d'une balise **script** de type *module*.

``` html
<script type="module">
    import * as Gp from "chemin/vers/GpServices.js";
    // puis, utilisation de la variable globale 'Gp' dans le module ES6...
</script>
```

### Intégration dans un front-end type Angular ou React

Intégrez la bibliothèque d'accès dans votre module à l'aide de la fonction **import**.

``` js
import * as Gp from "chemin/vers/GpServices.js";
```

> **Note :**
Dans un environnement **Front-End**, il faut installer les 2 dépendances suivantes dans votre projet :
- xmldom
- request

### Utilisation

Le chargement de la bibliothèque d'accès vous donne accès au namespace [Gp.Services](http://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html) à partir duquel vous pouvez utiliser les différentes fonctions proposées.



<a id="geocode"/>

### Géocoder des adresses, toponymes et parcelles cadastrales

La fonction [Gp.Services.geocode](http://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html#~geocode) permet d'utiliser le service de géocodage de la plateforme Géoportail pour obtenir la position d'un toponyme, d'une adresse ou d'une parcelle cadastrale. Elle prend en paramètres :

* une **clef d'accès à la plateforme Géoportail** obtenue sur le site [professionnels.ign.fr](http://professionnels.ign.fr/ign/contrats) ayant les droits sur les ressources de recherche OpenLS du Géoportail.

* le **localisant** dont on veut obtenir les coordonnées ;

* le **type de localisant** : adresse ("StreetAddress"), toponyme ("PositionOfInterest") ou parcelle cadastrale ("CadastralParcel"). Choix multiple possible. Par défaut les adresses seront utilisées.

* d'autres paramètres éventuels à passer au service...

* la **fonction de traitement des résultats** qui sera appelée lorsqu'ils seront reçus. Cette fonction prend en paramètres un objet de type : [Gp.Services.GeocodeResponse](http://ignf.github.io/geoportal-access-lib/latest/jsdoc/Gp.Services.GeocodeResponse.html).


``` javascript
Gp.Services.geocode({
    apiKey : "22726iz9m8ficsgf2hmiicpd", // clef d'accès à la plateforme
    location : "tour eiffel",            // localisant à géocoder
    filterOptions : {
        type : ["PositionOfInterest"]    // type de localisant
    },
    onSuccess : function (result) {
        // exploitation des resultats : "result" est de type Gp.Services.GeocodeResponse
        ...
    }

});
```

**Exemple d'utilisation** [![jsFiddle](http://jsfiddle.net/img/embeddable/logo-dark.png)](http://jsfiddle.net/ignfgeoportail/saye4oaz/embedded/result,js,html,css/)


<a id="autocomplete"/>

### Obtenir des suggestions d'adresses ou de toponymes à partir de textes incomplets

La fonction [Gp.Services.autoComplete](http://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html#~autoComplete) permet d'utiliser le service d'autocomplétion de la plateforme Géoportail pour obtenir des suggestions de loclalisants (toponyme ou adresse) à partir d'un texte incomplet. Elle prend en paramètres :

* une **clef d'accès à la plateforme Géoportail** obtenue sur le site [professionnels.ign.fr](http://professionnels.ign.fr/ign/contrats) ayant les droits sur les ressources de recherche OpenLS du Géoportail.

* le **texte** pour lequel on souhaite obtenir des suggestions

* le **type de localisant** : adresse ("StreetAddress") ou toponyme ("PositionOfInterest"). Choix multiple possible. Par défaut les adresses seront utilisées.

* d'autres paramètres éventuels à passer au service...

* la **fonction de traitement des résultats** qui sera appelée lorsqu'ils seront reçus. Cette fonction prend en paramètres un objet de type : [Gp.Services.AutoCompleteResponse](http://ignf.github.io/geoportal-access-lib/latest/jsdoc/Gp.Services.AutoCompleteResponse.html).


``` javascript
Gp.Services.autoComplete({
    apiKey : "22726iz9m8ficsgf2hmiicpd", // clef d'accès à la plateforme
    text : "23 rue des et",              // texte à compléter
    filterOptions : {
        type : ["StreetAddress"]         // type de texte
    },
    onSuccess : function (result) {
        // exploitation des resultats : "result" est de type Gp.Services.AutoCompleteResponse
        ...
    }

});
```

**Exemple d'utilisation** [![jsFiddle](http://jsfiddle.net/img/embeddable/logo-dark.png)](http://jsfiddle.net/ignfgeoportail/jsjqk4wq/embedded/result,js,html,css/)


<a id="reverseGeocode"/>

### Obtenir des localisants (toponymes, adresses, parcelles cadastrales) proches d'une position donnée (géocodage inverse)

La fonction [Gp.Services.reverseGeocode](http://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html#~reverseGeocode) permet d'utiliser le service de géocodage inverse de la plateforme Géoportail pour trouver des toponymes, adresses ou parcelles cadastrales proches d'une position donnée. Elle prend en paramètres :

* une **clef d'accès à la plateforme Géoportail** obtenue sur le site [professionnels.ign.fr](http://professionnels.ign.fr/ign/contrats) ayant les droits sur les ressources de recherche OpenLS du Géoportail.

* une **position** donnée

* le **type de localisant** : adresse ("StreetAddress"), toponyme ("PositionOfInterest") ou parcelle cadastrale ("CadastralParcel"). Choix multiple possible. Par défaut les adresses seront utilisées.

* d'autres paramètres éventuels à passer au service...

* la **fonction de traitement des résultats** qui sera appelée lorsqu'ils seront reçus. Cette fonction prend en paramètres un objet de type : [Gp.Services.GeocodeResponse](http://ignf.github.io/geoportal-access-lib/latest/jsdoc/Gp.Services.GeocodeResponse.html).


``` javascript
Gp.Services.reverseGeocode({
    apiKey : "22726iz9m8ficsgf2hmiicpd", // clef d'accès à la plateforme
    position : {                         // position de recherche
      x: 2.29,
      y: 48.85
    },
    filterOptions : {
        type : ["PositionOfInterest"]    // type de localisant
    },
    onSuccess : function (result) {
        // exploitation des resultats : "result" est de type Gp.Services.ReverseGeocodeResponse
        ...
    }

});
```

**Exemple d'utilisation** [![jsFiddle](http://jsfiddle.net/img/embeddable/logo-dark.png)](http://jsfiddle.net/ignfgeoportail/4t0wfey5/embedded/result,js,html,css/)


<a id="alti"/>

### Obtenir des altitudes en un ou plusieurs points ou calculer des profils altimétriques

La fonction [Gp.Services.getAltitude()](http://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html#~getAltitude) permet d'utiliser le service d'altimétrie de la plateforme Géoportail pour obtenir les altitudes de une ou plusieurs positions données ou calculer un profil altimétrique le long d'une liste de positions. Elle prend en paramètres :

* une **clef d'accès à la plateforme Géoportail** obtenue sur le site [professionnels.ign.fr](http://professionnels.ign.fr/ign/contrats) ayant les droits sur les ressources altimétriques du Géoportail.

* une **liste de positions** données

* un éventuel paramètre (sampling) indiquant le **nombre de points intermédiaires** à utiliser dans le cas du calcul d'un profil altimétrique.

* d'autres paramètres éventuels à passer au service...

* la **fonction de traitement des résultats** qui sera appelée lorsqu'ils seront reçus. Cette fonction prend en paramètres un objet de type : [Gp.Services.AltiResponse](http://ignf.github.io/geoportal-access-lib/latest/jsdoc/Gp.Services.AltiResponse.html).


``` javascript
Gp.Services.getAltitude({
    apiKey : "22726iz9m8ficsgf2hmiicpd", // clef d'accès à la plateforme
    positions : [                        // positions pour le calcul alti
        { lon: 2.29, lat: 48.85 },      
        { lon: 2.3, lat: 48.9 },
        { lon: 2.4, lat: 49 }
    ],
    sampling : 50,                      // nombre de points pour le profil
    onSuccess : function (result) {
        // exploitation des resultats : "result" est de type Gp.Services.AltiResponse
        ...
    }
});
```

**Exemple d'utilisation** [![jsFiddle](http://jsfiddle.net/img/embeddable/logo-dark.png)](http://jsfiddle.net/ignfgeoportail/owxffaf3/embedded/result,js,html,css/)


<a id="route"/>

### Calculer un itinéraire piéton ou routier

La fonction [Gp.Services.route()](http://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html#~route) permet d'utiliser le service de calcul d'itinéraires de la plateforme Géoportail. Elle prend en paramètres :

* une **clef d'accès à la plateforme Géoportail** obtenue sur le site [professionnels.ign.fr](http://professionnels.ign.fr/ign/contrats) ayant les droits sur les ressources utilisés par le calcul d'itinéraire du Géoportail : graphe routier ou piéton.

* des **points de départ, d'arrivée** et éventuellement **intermédiaires**.

* le **graphe** utilisé pour le calcul correspondant au profil de véhicule (piéton ou routier)

* d'autres paramètres éventuels à passer au service...

* la **fonction de traitement des résultats** qui sera appelée lorsqu'ils seront reçus. Cette fonction prend en paramètres un objet de type : [Gp.Services.RouteResponse](http://ignf.github.io/geoportal-access-lib/latest/jsdoc/Gp.Services.RouteResponse.html).


``` javascript
Gp.Services.route({
    apiKey : "jhyvi0fgmnuxvfv0zjzorvdn", // clef d'accès à la plateforme
    startPoint : { x: 2, y: 45},       // point de départ
    viaPoints : [                        // points intermédiaires
        { x: 3, y: 46 },      
        { x: 3.5, y: 46 }
    ],
    endPoint : { x: 4, y: 47},          // point d'arrivée
    graph : "Voiture",                 // grapĥe utilisé
    onSuccess : function (result) {
        // exploitation des resultats : "result" est de type Gp.Services.RouteResponse
        ...
    }
});
```

**Exemple d'utilisation** [![jsFiddle](http://jsfiddle.net/img/embeddable/logo-dark.png)](http://jsfiddle.net/ignfgeoportail/prvrjd93/embedded/result,js,html,css/)


<a id="isoCurve"/>

### Calculer des isochrones / isodistances autour d'un point

La fonction [Gp.Services.isoCurve()](http://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html#~isoCurve) permet d'utiliser le service de calcul d'isochrones / isodistances de la plateforme Géoportail. Elle prend en paramètres :

* une **clef d'accès à la plateforme Géoportail** obtenue sur le site [professionnels.ign.fr](http://professionnels.ign.fr/ign/contrats) ayant les droits sur les ressources utilisés par le calcul d'isochrones / isodistances du Géoportail : graphe routier ou piéton.

* une **position de référence** (départ ou arrivée) pour le calcul.

* la **limite de temps ou distance** pour le calcul.

* le **type de calcul** (isochrone ou isodistance).

* le **graphe** utilisé pour le calcul correspondant au profil de véhicule (piéton ou routier)

* d'autres paramètres éventuels à passer au service...

* la **fonction de traitement des résultats** qui sera appelée lorsqu'ils seront reçus. Cette fonction prend en paramètres un objet de type : [Gp.Services.IsoCurveResponse](http://ignf.github.io/geoportal-access-lib/latest/jsdoc/Gp.Services.IsoCurveResponse.html).


``` javascript
Gp.Services.isoCurve({
    apiKey : "jhyvi0fgmnuxvfv0zjzorvdn", // clef d'accès à la plateforme
    position : { x: 2, y: 45},       // point de référence
    method : "time",                   // méthode de calcul (isochrone)
    time : 1000,                       // limite de temps (isochrone)
    graph : "Pieton",                 // grapĥe utilisé
    onSuccess : function (result) {
        // exploitation des resultats : "result" est de type Gp.Services.IsoCurveResponse
        ...
    }
});
```

**Exemple d'utilisation** [![jsFiddle](http://jsfiddle.net/img/embeddable/logo-dark.png)](http://jsfiddle.net/ignfgeoportail/x1hcak86/embedded/result,js,html,css/)


<a id="getConfig"/>

## Obtenir des informations relatives à un contrat d'accès au Géoportail

La fonction [Gp.Services.getConfig()](http://ignf.github.io/geoportal-access-lib/latest/jsdoc/module-Services.html#~getConfig) permet de consulter, via le service d'autoconfiguration de la plateforme Géoportail, les ressources disponibles pour une clef d'accès à la plateforme et d'avoir les paramètres permettant leur utilisation. Elle prend en paramètres :

* une **clef d'accès à la plateforme Géoportail** obtenue sur le site [professionnels.ign.fr](http://professionnels.ign.fr/ign/contrats) dont on veut consulter les droits.

* d'autres paramètres éventuels à passer au service...

* la **fonction de traitement des résultats** qui sera appelée lorsqu'ils seront reçus. Cette fonction prend en paramètres un objet de type : [Gp.Services.GetConfigResponse](http://ignf.github.io/geoportal-access-lib/latest/jsdoc/Gp.Services.GetConfigResponse.html). Les informations portées par cet objet sont aussi enregistrées en variable globale de l'application sous le nom : Gp.Config.


``` javascript
Gp.Services.getConfig({
    apiKey : "jhyvi0fgmnuxvfv0zjzorvdn", // clef d'accès à la plateforme
    onSuccess : function (result) {
        // exploitation des resultats : "result" est de type Gp.Services.GetConfigResponse
        ...
    }
});
```

**Exemple d'utilisation** [![jsFiddle](http://jsfiddle.net/img/embeddable/logo-dark.png)](http://jsfiddle.net/ignfgeoportail/0hsanbv2/embedded/result,js,html,css/)
