const fs = require("fs");
const os = require("os");
const path = require("path");

const inquirer = require("inquirer");

const gitlabRequest = require("./gitlab-request");

const FILENAME = path.resolve(os.homedir(), ".gitlab-toggl-timer.config");

const TogglClient = require("toggl-api");

module.exports = function(){
	return new Promise(function(resolve, reject){
		var config;
		if(fs.existsSync(FILENAME)){
			const content = fs.readFileSync(FILENAME);

			try {
				config = JSON.parse(content);				
			}catch(err){
				reject(err);
			}

			resolve(config);
		}else{
			console.log("Config file is missing, creating one.");
			inquirer.prompt(QUESTIONS).then(function(answers){
				config = {
					gitlab: {
						host: answers.gitlabHost,
						apiToken: answers.gitlabToken
					},
					toggl: {
						apiToken: answers.togglToken
					}
				};
				fs.writeFileSync(FILENAME, JSON.stringify(config, null, 2));

				console.log("Config file created!", FILENAME);

				resolve(config);
			});

		}
	});
};

var tmp_gitlabHost;

const QUESTIONS = [
	{
		name: "gitlabHost",
		type: "input",
		default: "gitlab.com",
		message: "Enter your gitlab hostname",
		validate: function(host){
			if(host.match(/^[a-z]+(\.[a-z]+)+$/)){
				tmp_gitlabHost = host;
				return true;
			}
			return "Hostname is invalid";
		}
	},
	{
		name: "gitlabToken",
		type: "input",
		message: "Enter your GitLab token",
		validate: function(token){
			return new Promise(function(resolve, reject){
				if(!token.match(/^[a-zA-Z0-9]{20}$/)){
					return reject("Token is invalid");
				}

				logIsTestingToken();

				gitlabRequest(
					{
						host: tmp_gitlabHost,
						apiToken: token
					}, 
					{
						path: "/api/v4/version"
					},
					function(response){
						if(response.error){
							reject("Token is invalid: " + response.error);
						}else if(response.message){
							reject("Token is invalid: " + response.message);
						}else{
							resolve(true);
						}
					});
			});
		}
	},
	{
		name: "togglToken",
		type: "input",
		message: "Enter your Toggl token",
		validate: function(token){
			return new Promise(function(resolve, reject){
				if(!token.match(/^[a-f0-9]{32}$/)){
					return reject("Token is invalid");
				}

				logIsTestingToken();

				const toggl = new TogglClient({
					apiToken: token
				});
				toggl.getWorkspaces(function(err, workspaces){
					if(err){
						reject("Token is invalid: ", err.message || err);
					}else{
						resolve(true);
					}
				});
			});
		}
	}
];

function logIsTestingToken(){
	console.log("");
	console.log("Sending test request to validate token. Please wait...");
}