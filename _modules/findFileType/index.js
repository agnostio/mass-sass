const fs = require('fs');
//                directory, extension, filter function
module.exports = (e, d, b) => {
	var findFileType = (e, d, b) => {
		var c = [],
			g = fs.readdirSync(e);
		b || (b = function() {
			return !0
		});
		g.forEach(function(a) {
			a = e + "/" + a;
			var f = fs.statSync(a);
			f && f.isDirectory() ? c = c.concat(findFileType(a, d, b)) : a.substr(a.length - (d.length + 1)) === "." + d && b(a) && c.push(a)
		});
		return c
	};
	return findFileType(e, d, b);
};
