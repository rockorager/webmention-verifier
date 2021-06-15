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
    validUrl,
};

