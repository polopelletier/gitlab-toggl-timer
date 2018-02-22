/* globals exitWithError */

const TogglClient = require("toggl-api");

const getGitInfo = require("./utils/get-git-info");
const findProjectId = require("./utils/find-project-id");

module.exports = function(config, args){
	const toggl = new TogglClient(config.toggl);

	const gitInfo = getGitInfo(args);

	toggl.getCurrentTimeEntry(function(err, entry) {
		if(entry != null){
			exitWithError(`Error: A task is currently in progress: ${entry.description}`);
		}

		findProjectId(toggl, gitInfo.projectName, function(pid){
			toggl.startTimeEntry({
				description: gitInfo.featureName,
				pid: pid
			}, function(err, entry){
				if(err){
					exitWithError(err);
				}
				console.log(`[${entry.start}] Started working on '${entry.description}'`);
			});
		});
	});
};