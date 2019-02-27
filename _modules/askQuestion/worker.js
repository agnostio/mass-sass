var inquirer = require("inquirer");
inquirer.registerPrompt('directory', require('inquirer-select-directory'));
process.on('message', function(obj) {
	inquirer.prompt([obj.question]).then(function(answer) {
		process.send(answer);
	});
});
