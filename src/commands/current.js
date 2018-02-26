/* globals exitWithError */

const moment = require("moment");
const TogglClient = require("toggl-api");

const getGitInfo = require("./utils/get-git-info");

module.exports = function(config, args){
	const toggl = new TogglClient(config.toggl);

	const gitInfo = getGitInfo(args);

	toggl.getCurrentTimeEntry(function(err, entry) {
		if(err){
			exitWithError("[TOGGL]", err);
		}

		if(!entry){
			exitWithError("Not working on any task right now.");
		}

		if(entry.description != gitInfo.featureName){
			exitWithError(`Current time entry is '${entry.description}' but working on branch '${gitInfo.featureName}'. \nEither switch branch or stop the entry manualy.`);
		}

		const start = moment(entry.start);

		console.log(`Current time entry is '${entry.description}'`);
		console.log("Started", start.calendar());
		
		const diff = moment().diff(start);
		const duration = moment.duration(Math.round(diff/1000), "seconds")
			.toISOString().split("T")[1]
			.toLowerCase();

		console.log(`Current duration: ${duration}`);
		process.exit();
	});
};