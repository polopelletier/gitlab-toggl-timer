/* globals exitWithError */

const git = require("git-controller")(process.cwd());

const ISSUE_ID_REGEXP = /^(\d+)-/;
const PROJECT_NAME_REGEXP = /^(http(?:s)?):\/\/([\w.]+)\/(.*\/*.)\.git$/;

function getFeatureName(){
	const branches = git.getBranchesSync(); 
	if(!branches || !branches.current){
		exitWithError("[GIT]", "Could not load branches.");
	}

	if(branches.current == "master"){
		exitWithError("Cannot track time on branch 'master'.");
	}

	return branches.current;
}

function getIssueId(featureName){
	const matches = ISSUE_ID_REGEXP.exec(featureName);
	
	if(!matches || !matches[1]){
		exitWithError(`Could not get issue id from branch name '${featureName}'.`);
	}

	return Number(matches[1]);
}

function getRemote(remoteName){
	const remotes = git.getRemotesSync();
	if(!remotes){
		exitWithError("[GIT]", "Could not load remotes.");
	}

	if(!remotes[remoteName]){
		exitWithError("[GIT]", `Could not find remote '${remoteName}'.`);
	}

	const url = remotes[remoteName];
	const matches = PROJECT_NAME_REGEXP.exec(url);
	if(!matches || !matches[1] || !matches[2] || !matches[3]){
		exitWithError(`Could not find GitLab namespace/project from url '${url}'.`);
	}
	
	return {
		protocol: matches[1],
		host: matches[2],
		project: matches[3]
	};
}

module.exports = function(args){
	const featureName = getFeatureName();
	const issueId = getIssueId(featureName);
	const remote = getRemote(args.remote);

	return {
		featureName: featureName,
		issueId: issueId,
		protocol: remote.protocol,
		host: remote.host,
		projectName: remote.project,
	};
};