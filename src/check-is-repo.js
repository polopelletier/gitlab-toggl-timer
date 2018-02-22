const fs = require("fs");
const path = require("path");

const gitDirectory = path.resolve(process.cwd(), ".git");
if(!fs.existsSync(gitDirectory)){
	throw new Error("Work directory is not a git repository");
}