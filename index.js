#!/usr/bin/env node

/* globals exitWithError */

const commandParser = require("./src/command-parser");
const loadConfig = require("./src/load-config");

global.exitWithError = function(err){
	console.error(err.message || err);
	process.exit();
};

try {
	require("./src/check-is-repo");

	loadConfig().then(commandParser)
		.catch(exitWithError);
}catch(err){
	exitWithError(err);
}