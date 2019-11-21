jsdoc-webpack-plugin
==========================


WebPack plugin that runs [jsdoc](http://usejsdoc.org/) on your bundles

# Usage
In webpack.config.js:
```javascript
var webpack = require('webpack');
var JsDocPlugin = require('jsdoc-webpack-plugin');

module.exports = {
    /// ... rest of config
    plugins: [
        new JsDocPlugin({
            conf: './jsdoc.conf'
        })
    ]
}

```

There are two ways how this plugin recognizes the files

1. It takes the information from the jsdoc config file "source.include"
2. If no "source.include" provided, it takes the whole files from your bundles
