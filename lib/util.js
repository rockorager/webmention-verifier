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
        if (JSON.stringify(item[j]).search(target) >= 0 && j != "content") {
            targetInSource = true;
            item[j] = target;
            mention = item;
            mention["wm-property"] = j;
            
        }
    }

    // If we haven't found the target in a specified 'u-arbitrary' class, check if it's just mentioned in the content
    if (targetInSource === false && JSON.stringify(item).search(target) >= 0) {
        targetInSource = true;
        mention = item;
        mention["wm-property"] = "mention-of";
        mention["mention-of"] = target;
    }

    return { targetInSource, mention } ;
};

// Verify if URL is valid
function isUrl(s) {
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
    isUrl,
};

