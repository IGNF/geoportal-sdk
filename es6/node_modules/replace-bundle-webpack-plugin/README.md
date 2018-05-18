replace-bundle-webpack-plugin
===
replace string for webpack compiled bundle, different with string-replace-webpack-plugin, this plugin is run at depends modules compiled, so you can replace any string, even   `require`.
---
#  Example Usage
```js
var ReplaceBundleStringPlugin = require('replace-bundle-webpack-plugin')

plugins: [
    new ReplacePlugin([{
        partten: /window.require/g,
        replacement: function () {
            return 'require';
        }
    }])
]

```