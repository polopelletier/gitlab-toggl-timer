#!/usr/bin/env node

/* globals exitWithError */

const commandParser = require("./src/command-parser");
const loadConfig = require("./src/load-config");

global.exitWithError = function(){
	const args = Array.prototype.slice.apply(arguments);
	const message = args.reduce(function(message, part){
		return message + (part.message || part) + " ";
	}, "");

	console.error("Error:", message);
	process.exit();
};

try {
	require("./src/check-is-repo");

	loadConfig().then(commandParser)
		.catch(exitWithError);
}catch(err){
	exitWithError(err);
}