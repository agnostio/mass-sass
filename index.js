#!/usr/bin/env node
let banner = require('./banner');
banner += `
    - Mass Sass

This program compiles SCSS to CSS using node-sass
`;
const watch = require('node-watch');
const fs = require('fs');
const xcon = require('x-con');
const compileList = require('./_modules/compileList');
const seq = require('funcseq');
const askQuestion = require('./_modules/askQuestion');
const findFileType = require('./_modules/findFileType');
const locationInfo = require('./_modules/locationInfo');
const _ = require('lodash');
const wait = {
	frames: ['Watching for changes ', 'Watching for changes .', 'Watching for changes ..', 'Watching for changes ...'],
	looper: null,
	start: function(arg) {
		var i = 0;
		xcon.on();
		this.looper = setInterval(() => {
			var frame = this.frames[i = ++i % this.frames.length];
			xcon.post([
				{
					style: [
				            '#deb012',
				            'bold',
				            'bg #000'

				        ],
					str: frame
				    }
				]);
		}, 300);
	},
	stop: function() {
		clearInterval(this.looper);
		xcon.off();
	}
};


var overWrite = false;xcon.post([
	{
		style: [
			'#27cf2f',
			'bold',
			'bg #000'

		],
		str: banner
	}

]);
var seq1 = {
	functionArray: [
		(complete) => {
			askQuestion({
				question: {
					type: 'list',
					name: 'ready',
					message: 'Ready?',
					choices: [
						{
							name: 'Start',
							value: 'Start'
						}

					],
				},
				valid: null,
				cb: (answer) => {
					complete();
				}
			});
		},
		(complete, arg) => {
			askQuestion({
				question: {
					type: 'directory',
					name: 'location',
					message: 'Which folder would you like to work on?',
					basePath: process.cwd()
				},
				valid: null,
				cb: (answer) => {
					var fileName;
					var scss = findFileType(answer.location, 'scss', (str) => {
						fileName = str.split('/');
						fileName = fileName.pop();
						return str.indexOf('node_modules') === -1 && fileName.substr(0, 1) !== '_';
					});
					var conflicts = [];
					var a;
					for (i = 0; i < scss.length; i++) {
						var a = scss[i].substr(0, scss[i].length - 4) + 'css';
						if (locationInfo(a).exists) {
							conflicts.push(a);
						}
					}
					complete(_.merge(arg, {
						conflicts,
						scss,
						location: answer.location
					}));
				}
			});
		},
		(complete, arg) => {
			if (arg[0].conflicts.length) {
				xcon.post([
					{
						style: [
				            '#deb012',
				            'bold',
				            'bg #000'

				        ],
						str: `The following files already exists:`
				    }
				]);
				xcon.post([
					{
						style: [
					            '#deb012',
					            'bold',
					            'bg #000'
					        ],
						str: `${arg[0].conflicts.join(', \n')}`
					}
				]);
				askQuestion({
					question: {
						type: 'confirm',
						name: 'overWrite',
						message: `Would you like to overwrite?`,
						default: true
					},
					valid: null,
					cb: (answer) => {
						overWrite = answer.overWrite;
						complete(_.merge(arg[0], answer));
					}
				});
			} else if (!arg[0].scss.length) {
				xcon.post([
					{
						style: [
				            '#deb012',
				            'bold',
				            'bg #000'

				        ],
						str: `Zero SCSS files were found in ${arg[0].location}`
				    }
				]);
			} else {
				complete(arg[0]);
			}
		},
		(complete, arg) => {
			switch (true) {
				case arg[0].conflicts.length && arg[0].overWrite:
					compileList(arg[0].scss, () => {
						complete(arg[0]);
					});
					break;
				case arg[0].scss.length && !arg[0].conflicts.length:
					compileList(arg[0].scss, () => {
						complete(arg[0]);
					});
					break;
				default:
					process.exit();
					break;
			}
		},
		(complete, arg) => {
			askQuestion({
				question: {
					type: 'confirm',
					name: 'watch',
					message: `Compile again every time an SCSS file changes?`,
					default: true
				},
				valid: null,
				cb: (answer) => {
					delete arg[0].conflicts;
					delete arg[0].scss;
					complete(_.merge(arg[0], answer));
				}
			});
		}
	],
	completeFunction: (arg) => {
		if (arg[0].watch) {
			var SCSSparents = () => {
				return findFileType(arg[0].location, 'scss', (str) => {
					fileName = str.split('/');
					fileName = fileName.pop();
					return str.indexOf('node_modules') === -1 && fileName.substr(0, 1) !== '_';
				});
			};
			wait.start();
			watch('./', {
				filter: /\.scss$/,
				recursive: true
			}, (e, name) => {
				wait.stop();
				compileList(SCSSparents(), (arg) => {
					wait.start();
				});
			});
		} else {
			process.exit();
		}
	}
};




seq(seq1);
