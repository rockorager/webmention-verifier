const util = require("./util");
const URL = require('url').URL;

/*
 *
 * Accepts source and target URLs as strings
 */

module.exports = function (source, target, validDomain) {
	if (!util.validUrl(source)) {
		return {
			statusCode: 400,
			body: "Source is not a valid URL",
		};
	}
	if (!util.validUrl(target)) {
		return {
			statusCode: 400,
			body: "Target is not a valid URL",
		};
	}
	if (source === target) {
		return {
			statusCode: 400,
			body: "Source and target are same URL",
		};
	}
	//TODO Fix this

	if (validDomain != new URL(target).base) {
		console.log(validDomain);
		console.log(new URL(target.base));
		return {
			statusCode: 400,
			body: "Target domain is not accepted by this server",
		};
	}


};
