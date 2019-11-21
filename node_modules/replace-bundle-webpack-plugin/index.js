/**
 * @module index.js
 * @desc
 * @author Created by kimhou on 16/2/2
 */


'use strict';
var ConcatSource = require('webpack-core/lib/ConcatSource');

function ReplaceBundlePlugin(args) {
	if (!( args instanceof  Array)) {
		throw new TypeError('Argument "args" must be an array.');
	}

	this.replacements = args;
}


function apply(compiler) {
	compiler.plugin('compilation',  (compilation)=> {
		compilation.plugin('optimize-chunk-assets',  (chunks, done)=> {
			replaceBundleStrings(compilation, chunks, this.replacements);
			done();
		})
	});
}

function replaceBundleStrings(compilation, chunks, replacements){
	chunks.forEach(function (chunk) {
		chunk.files.forEach(function (fileName) {
			replaceFile(compilation, fileName, replacements);
		});
	});
}

function replaceFile(compilation, fileName, replacements){
	var result = compilation.assets[fileName].source();

	replacements.forEach(function (replacement) {
		if(!replacement.skip && replacement.partten && replacement.replacement){
			result = result.replace(replacement.partten, replacement.replacement);
		}
	});
	compilation.assets[fileName] = new ConcatSource(result);
}

Object.defineProperty(ReplaceBundlePlugin.prototype, 'apply', {
	value: apply,
	enumerable: false
});

module.exports = ReplaceBundlePlugin;