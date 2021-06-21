const hcard = require("representative-h-card");
const parser = require("./parser");
const URL = require("url").URL;
const util = require("./util");

/*
 *
 * Accepts source and target URLs as strings. acceptableHost is the hostname of targets that this server can receive
 */

module.exports = async function (source, target, acceptableHost) {
	if (!util.isUrl(source)) {
		return {
			statusCode: 400,
			body: "Source is not a valid URL",
		};
	}
	if (!util.isUrl(target)) {
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

	const sourceHtml = await util.fetchHtml(source);

	if (sourceHtml === false) {
		return {
			statusCode: 400,
			body: "Source url does not exist",
		};
	}

	const mf2 = parser.mf2(sourceHtml, source);
	const jf2 = parser.mf2tojf2(mf2);

	var res = {
		targetInSource: false,
		mention: {},
	};

	if (jf2.children) {
		jf2.children.find(function (item) {
			if (item.type === "card") {
        		sourceAuthor = item;
        	} else {
        		const itemRes = util.findTarget(item, target);
        		if (itemRes.targetInSource === true) {
        			res = itemRes;
        			return true;
        		}
        	}
		});
	} else {
		res = util.findTarget(jf2, target);
	}

	if (res.targetInSource === false) {
		return {
			statusCode: 400,
			body: "Source does not mention target",
		};
	}

	const mention = res.mention;
	mention["wm-target"] = target;
	mention["wm-source"] = source;
	mention["wm-received"] = new Date().toISOString();

	// Handle if mention doesn't have a u-url, which microformat-node will set to the target if it isn't present
	if(mention.url === target) {
		mention.url = source;
	}

	// TODO Do the author figuring https://authorship.rocks/

	// Authorship

	// If h-entry has author, that is author
	// If h-entry doesn't have author, and is part of a feed, author of feed is the author
	if (
		!mention.hasOwnProperty("author") &&
		jf2.hasOwnProperty("children") &&
		jf2.hasOwnProperty("author")
	) {
		mention.author = jf2.author;
	}

	// If author was found and is h-card, done
	// If not an h-card, check if URL and find author on linked page using representative h-card parsing
	// if not a URL, use whatever it is as author
	if (
		mention.hasOwnProperty("author") &&
		!mention.author.hasOwnProperty("type")
	) {
		if (util.isUrl(mention.author)) {
			var authorUrl = mention.author;
			// process mention.author for representative h-card
			var authorHtml = await util.fetchHtml(authorUrl);
			var authorMf2 = parser.mf2(authorHtml, authorUrl);
			var authorCard = hcard(authorMf2, authorUrl);
			if (authorCard) {
				mention.author = parser.flattenProperties(authorCard);
			}
		}
	}

	// Check if page has a rel-author if no author is found yet
	if(!mention.hasOwnProperty('author') && mf2.rels.hasOwnProperty('author')) {
		// Use only the first one
		if (util.isUrl(mf2.rels.author[0])) {
			authorUrl = mf2.rels.author[0];
			// process mention.author for representative h-card
			authorHtml = await util.fetchHtml(authorUrl);
			authorMf2 = parser.mf2(authorHtml, authorUrl);
			authorCard = hcard(authorMf2, authorUrl);
			if (authorCard) {
				mention.author = parser.flattenProperties(authorCard);
			}
		}
	}

	// check if page has a representative h card
	return mention;
};
