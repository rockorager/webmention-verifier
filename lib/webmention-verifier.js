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

	const jf2 = parser(targetHtml, target);

	var sourceAuthor = {};
	var mention = {};
	var resp = {};

// TODO Work on this part untilll....
	if (jf2.children) {
        for (const i in jf2.children) {
            // Loop through item values and find target url as a value
            if (jf2.children[i] === "card") {
                sourceAuthor = jf2.children[i];
            }
            resp = findTarget(jf2.children[i], target);
            
            if(resp.targetInSource) {
                mention = resp.mention;
                urlExists = resp.targetInSource;
                mention.author = sourceAuthor;
            }
        }
    } else {
        resp = findSource(jf2,data.target);
        mention = resp.mention;
        urlExists = resp.targetInSource;
    }

    if (!mention.author.type) {
        try {
            const authorURL = new URL(mention.author).origin;
            const authorHTML = await fetchHtml(mention.author);
            const authorOptions = {
                "html": authorHTML,
                "baseUrl": authorURL,
                "filter": ['h-card']
            };
            const authorJf2 = flattenItems(mf.get(authorOptions).items);
            console.log(authorJf2.children[0].type);
            if (authorJf2.children[0].type === 'card') {
                mention.author = authorJf2.children[0];
            }
            if (authorJf2.children[0].type === 'feed') {
                mention.author = authorJf2.children[0].author;
                console.log(mention.author);
            }
            if (Array.isArray(mention.author.url)) {
                mention.author.url = mention.author.url[0];
            }

        } catch (err) {
            // TODO error handling if mention.author isn't a URL
        }
    }
// TODO This part...
};
