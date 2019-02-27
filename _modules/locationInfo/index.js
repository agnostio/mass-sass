const fs = require('fs');

module.exports = (a) => {
	var stats = null;
	var obj = {};
	var arr = null;
	try {
		stats = fs.lstatSync(a);
	} catch(b){}
	if(stats){
		obj.exists = true;
		obj.location = a;
		if(stats.isDirectory()){
			 obj.extension = a.substr(a.lastIndexOf('.')+1, a.length);
		}
	}
	else{
		obj.exists = false;
	}
	return obj;
};
