/* globals exitWithError */

const fs = require("fs");
const path = require("path");

const gitDirectory = path.resolve(process.cwd(), ".git");
if(!fs.existsSync(gitDirectory)){
	exitWithError("Error: Work directory is not a git repository");
}