const start = require("./commands/start");
const stop = require("./commands/stop");
const current = require("./commands/current");

module.exports = function(config){
	require("yargs")
		.command("start [remote]", "Start timer for current merge request", addRemotePositional, function(args){
			start(config, args);
		})
		.command("stop [remote]", "Stop timer for current merge request", addRemotePositional, function(args){
			stop(config, args);
		})
		.command("current [remote]", "Log current running timer", addRemotePositional, function(args){
			current(config, args);
		})
		//.command("report [remote]", "Get weekly report for current project", addRemotePositional, handlers.report)
		.demandCommand()
		.help()
		.argv;
};

function addRemotePositional(yargs){
	yargs.positional("remote", {
		describe: "Name of the remote on which gitlab is linked",
		default: "origin"
	});
}