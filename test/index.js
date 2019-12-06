/* global module */
if (module.hot) {
    const context = require.context(
        "mocha-loader!./spec", // Process through mocha-loader
        true, // Skip recursive processing
        ///\.test.js$/ // Pick only files ending with .test.js
        ///OlMap\.test.js/
        ///OlMapBox\.test.js/
        /ItMap\.test.js/
        ///SDK2D\.test.js/
        ///SDK3D\.test.js/

    );
    // debug...
    console.log("LIST TEST FILE :", context.keys());
    // Execute each test suite
    context.keys().forEach(context);
}
