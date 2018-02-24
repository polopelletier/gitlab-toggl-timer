/* globals exitWithError */

const moment = require("moment");
const TogglClient = require("toggl-api");

const getGitInfo = require("./utils/get-git-info");
const addSpentTime = require("./utils/add-spent-time");
const formatTime = require("./utils/format-time");

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

		toggl.stopTimeEntry(entry.id, function(err){
			if(err){
				exitWithError("[TOGGL]", err);
			}

			toggl.getTimeEntryData(entry.id, function(err, doneEntry){
				const duration = moment.duration(doneEntry.duration, "seconds")
					.toISOString().split("T")[1]
					.toLowerCase();

				console.log(`${formatTime(doneEntry.stop)} - Stopped working on '${doneEntry.description}'.`);

				addSpentTime(config.gitlab, gitInfo.projectName, gitInfo.featureName, duration, function(){
					process.exit();
				});
			});
		});
	});
};