const URL = require('url').URL;
const axios = require('axios');

// Fetch html from target url
async function fetchHtml(url) {
    try {
        var response = await axios.get(url);
        return response.data;
    } catch (err) {
        return false;
    }
}

// Find target url in source jf2 item
function findTarget(item, target) {
    let mention = {};
    let targetInSource = false;
    for (var j in item) {
        switch (j) {
            case "in-reply-to":
                if (JSON.stringify(item[j]).search(target) >= 0) {
                    targetInSource = true;
                    item[j] = target;
                    mention = item;
                    mention["wm-property"] = j;
                }
                break;
            case "like-of":
                if (JSON.stringify(item[j]).search(target) >= 0) {
                    targetInSource = true;
                    item[j] = target;
                    mention = item;
                    mention["wm-property"] = j;
                }
                break;
            case "repost-of":
                if (JSON.stringify(item[j]).search(target) >= 0) {
                    targetInSource = true;
                    mention = item;
                    mention["wm-property"] = j;
                    item[j] = target;
                }
                break;   
            case "bookmark-of":
                if (JSON.stringify(item[j]).search(target) >= 0) {
                    targetInSource = true;
                    item[j] = target;
                    mention = item;
                    mention["wm-property"] = j;
                }
                break;                     
        }
    }

    // If we still haven't found the target in the source, check if it's anywhere in the item
    if (targetInSource === false && JSON.stringify(item).search(target) >= 0) {
        targetInSource = true;
        mention = item;
        mention["mention-of"] = target;
        mention["wm-property"] = "mention-of";
    }

    return { targetInSource, mention } ;
};

// Verify if URL is valid
function validUrl(s) {
    try {
        new URL(s);
        return true;
    } catch (err) {
        return false;
    }
}



module.exports = {
    fetchHtml,
    findTarget,
    validUrl,
};

