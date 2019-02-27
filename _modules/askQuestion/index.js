//fix loop
const xcolor = require('xcolor');
var cp = require('child_process');
var child = null;
var ask = (obj, cb) => {
	child = cp.fork(__dirname + '/worker.js');
	child.send(obj);
	child.on('message', function(data) {
		cb(data);
		child.kill();
	});
	child.on('exit', function(e) {
		child.kill();
	});
};
var loopCheck = (obj, answer) => {
	var i = 0;
	var delay;
	var run = (i) => {
		obj.valid[i].func(obj.question, answer, (passed, question) => {
			if (delay < 50) delay = 50;
			if (passed) {
				if (i + 1 == obj.valid.length) {
					setTimeout(function() {
						obj.cb(answer);
					}, 50);
				} else {
					i++;
					run(i);
				}
			} else {
				obj.question = question;
				if (obj.valid[i].err.msg.length > 0) {
					xcolor.log(`{{#e80000}}{{bold}}Error:  ${obj.valid[i].err.msg}`);
				}
				setTimeout(function() {
					ask(obj, (answer) => {
						validate(obj, answer);
					});
				}, obj.valid[i].err.delay > 50 ? obj.valid[i].err.delay : 50);
			}
		});
	};
	run(i);
};
var validate = (obj, answer) => {
	if (!obj.valid) {
		setTimeout(function() {
			obj.cb(answer);
		}, 50);
	} else {
		loopCheck(obj, answer);
	}
};
module.exports = (obj) => {
	ask(obj, (answer) => {
		validate(obj, answer);
	});
};
