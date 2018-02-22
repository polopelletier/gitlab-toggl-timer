/* globals exitWithError */

module.exports = function(toggl, projectName, callback){
	toggl.getWorkspaces(function(err, workspaces){
		if(err){
			exitWithError(err);
		}

		var i = -1;

		function checkInNext(){
			i++;
			if(i >= workspaces.length){
				exitWithError(`Error: Project '${projectName}' not found in any workspaces`);
			}else{
				toggl.getWorkspaceProjects(workspaces[i].id, function(err, projects){
					if(err){
						exitWithError(err);
					}

					for(var j = 0; j < projects.length; j++){
						if(projects[j].name == projectName){
							callback(projects[j].id);
							return;
						}
					}
					checkInNext();
				});
			}
		}
		checkInNext();
	});
};