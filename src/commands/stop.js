/* globals exitWithError */

const moment = require("moment");
const TogglClient = require("toggl-api");

const getGitInfo = require("./utils/get-git-info");
const addSpentTime = require("./utils/add-spent-time");

module.exports = function(config, args){
	const toggl = new TogglClient(config.toggl);

	const gitInfo = getGitInfo(args);

	toggl.getCurrentTimeEntry(function(err, entry) {
		if(err){
			exitWithError(err);
		}

		if(!entry){
			exitWithError("Error: Not working on any task right now.");
		}

		if(entry.description != gitInfo.featureName){
			exitWithError(`Error: Current time entry is '${entry.description}' but working on branch '${gitInfo.featureName}'. Either switch branch or stop the entry manualy.`);
		}

		toggl.stopTimeEntry(entry.id, function(err){
			if(err){
				exitWithError(err);
			}

			toggl.getTimeEntryData(entry.id, function(err, doneEntry){
				const duration = moment.duration(doneEntry.duration, "seconds")
					.toISOString().split("T")[1]
					.toLowerCase();
				console.log(`Stopped working on '${doneEntry.description}'`);

				addSpentTime(config.gitlab, gitInfo.projectName, gitInfo.featureName, duration);
			});
		});
	});
};