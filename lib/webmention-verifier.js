const parser = require('./parser');
const URL = require('url').URL;
const util = require("./util");

/*
 *
 * Accepts source and target URLs as strings. acceptableHost is the hostname of targets that this server can receive
 */

module.exports = async function (source, target, acceptableHost) {
	
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

	acceptableHost = acceptableHost || new URL(target).host;
	if (acceptableHost != new URL(target).host) {
		return {
			statusCode: 400,
			body: "Target domain is not accepted by this server",
		};
	}

	const targetHtml = await util.fetchHtml(target);

	if (targetHtml === false) {
		return {
			statusCode: 400,
			body: "Target domain does not exist",
		};
	}

	const jf2 = parser(targetHtml, target)

};
