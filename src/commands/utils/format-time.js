const moment = require("moment");

module.exports = function(time){
	return moment(time).format("YYYY-MM-DD h:mm:ss A");
}