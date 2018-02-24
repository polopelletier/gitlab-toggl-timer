/* globals exitWithError */

const querystring = require("querystring");
const chalk = require("chalk");

const gitlabRequest = require("../../gitlab-request");

module.exports = function(config, project, feature, duration, onComplete){
	
	const issueId = feature.split("-")[0];
	project = querystring.escape(project);

	const options = {
		method: "POST",
		path: `/api/v4/projects/${project}/issues/${issueId}/add_spent_time?duration=${duration}`,
	};
	
	gitlabRequest(config, options, function(response){
		if(response.error || response.message){
			exitWithError("[GITLAB]", `Failed to add spent time to gitlab issue #${issueId}.`, (response.error || response.message));
		}

		columns("Time spent:      ", duration);
		columns("Estimate:        ", response.human_time_estimate);

		var c = chalk.greenBright;
		const spent = response.total_time_spent;
		const estimated = response.time_estimate;
		if(spent > estimated){
			c = chalk.redBright;
		} else if(spent / estimated > 0.8) {
			c = chalk.yellowBright;
		}
		columns("Total time spent:", c(response.human_total_time_spent));

		onComplete();
	});
};

function columns(header, content){
	console.log(chalk.bold(header), content);
}