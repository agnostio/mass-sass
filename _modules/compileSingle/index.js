var xcon = require('x-con');
var fs = require('fs');
var sass = require('node-sass');
var con = require('funccon');
const xcolor = require('xcolor');
module.exports = (src, cb, err) => {
	var folder = src.split('/');
	var name = folder.pop().split('.');
	var ext = name.pop();
	folder = folder.join('/');
	try {
		var result = sass.renderSync({
			file: src,
			outputStyle: 'compressed',
			outFile: 'true',
			sourceMap: `${name}.css.map`,
		});
		con({
			size: 15,
			funcs: [
				(complete) => {
					fs.writeFile(`${folder}/${name}.css`, result.css, (arg) => {
						complete();
					});
		        },
				(complete) => {
					fs.writeFile(`${folder}/${name}.css.map`, result.map, (arg) => {
						complete();
					});
		        }
	    	],
			done: function() {
				cb(`${folder}/${name}.${ext}`);
			}
		});
	} catch (e) {
		err(`
		Error:
		    	   File:       ${e.file}
		    	   Line:       ${e.line}
		    	   Message:    ${e.message}
		`.replace(/\t/g, ''));
	}
};
