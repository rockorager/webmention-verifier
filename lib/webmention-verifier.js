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

	const sourceHtml = await util.fetchHtml(source);

	if (sourceHtml === false) {
		return {
			statusCode: 400,
			body: "Source url does not exist",
		};
	}

	const jf2 = parser(sourceHtml, target);
	
	var sourceAuthor = {};
	var res = {
		'targetInSource': false,
		'mention': {}
	};

	if (jf2.children) {
        jf2.children.forEach(function(item, index, array){
        	if (item.type === "card") {
        		sourceAuthor = item;
        	} else {
        		const itemRes = util.findTarget(item, target);
        		if (itemRes.targetInSource === true) {
        			res = itemRes;
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

    // TODO Do the author figuring
/*
    if (!res.mention.author.type) {
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
*/

	const mention = res.mention;
    mention["wm-target"] = target;
    mention["wm-source"] = source;
    mention["wm-received"] = new Date().toISOString();

    return mention;

};
