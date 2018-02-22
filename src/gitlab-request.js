const https = require("https");

module.exports = function(config, options, handler){
	options.host = config.host;
	options.headers = Object.assign({}, options.headers || {}, {
		"Private-Token": config.apiToken
	});

	https.request(options, function(res){
		res.setEncoding("utf8");
		res.on("data", function(data){
			try {
				handler(JSON.parse(data));
			}catch(err){
				handler({
					error: err.message
				});
			}
		});
	}).end();
};