# Utilisation du dépôt de sources pour compiler *OpenLayers*

version 5.3.0 (tag)

## Construction des binaires et de l'indexe

```
openalyers.org$ git remote -v
origin	https://github.com/openlayers/openlayers.git (fetch)
origin	https://github.com/openlayers/openlayers.git (push)

openalyers.org$ git checkout v5.3.0
    Note : extraction de 'v5.3.0'.

openalyers.org$ npm run build-index
openalyers.org$ npm run build-package
openalyers.org$ npm run build-legacy (facultatif)
```

## Dépendances

```
openalyers.org$ cd build/ol
openalyers.org$ npm install
```

## Utilisation dans le projet SDK

Copie du build:

```
$ cp openalyers.org/build/ol projet-sdk/lib/openlayers/
$ cp openalyers.org/build/index.js projet-sdk/lib/openlayers/
$ cp openalyers.org/build/legacy projet-sdk/lib/openlayers/ (facultatif)
```

Utilisation dans webpack:

```
resolve : {
    alias : {
        "ol-dist" : path.join(__dirname, "lib", "openlayers", "index.js")
    }
},
```

```
module : {
    rules : [
    {
        /** openlayers est exposé en global : ol ! */
        test : path.resolve(__dirname, "lib", "openlayers", "index.js"),
        use : [{
            loader : "expose-loader",
            options : "ol"
        }]
    },
    ]
}
```

Utilisation dans le code:

cf. *SDK2D.js*
```
import { default as ol } from "ol-dist";
deepCopy(olExtended, ol);
// "ol" is exposed into window (for a build bundle) with webpack.
if (window && window.ol) {
    window.ol = ol;
}
```
