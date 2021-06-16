var assert = require('assert');
const parser = require('../lib/parser');


describe('parser()', function() {
  it('should parse html to jf2 and add baseUrl to relative links', function() {
    expected = JSON.parse(`
      {
        "type": "card",
        "name": "Mitchell Baker",
        "url": "http://blog.lizardwrangler.com/",
        "org": {
            "type":  "card",
            "name": "Mozilla Foundation",
            "url": "http://example.org/bios/mitchell-baker/"
         },
        "photo": "http://example.org/images/photo.gif"
      }`);
    const testHtml = `
      <div class="h-card">
        <a class="p-name u-url" href="http://blog.lizardwrangler.com/">Mitchell Baker</a> 
        (<a class="p-org h-card" href="bios/mitchell-baker/">Mozilla Foundation</a>)
        <img class="u-photo" src="images/photo.gif"/>
      </div>
    `;

    const actual = parser(testHtml,'http://example.org');
    assert.deepEqual(actual,expected);
  });

  it('should parse u-in-reply-to', function() {
    expected = JSON.parse(`
      { 
        "in-reply-to": "https://www.duckduckgo.com",
        "name": "DuckDuckGo",
        "type": "entry",
        "url": "https://www.duckduckgo.com"
      }`);
    const testHtml = '<div class="h-entry"><a class="u-in-reply-to" href="https://www.duckduckgo.com">DuckDuckGo</a></div>';
    const actual = parser(testHtml,'http://example.org');
    assert.deepEqual(actual,expected);
  });

  it('should parse u-arbitrary', function() {
    expected = JSON.parse(`
      { 
        "arbitrary": "https://www.duckduckgo.com",
        "name": "DuckDuckGo",
        "type": "entry",
        "url": "https://www.duckduckgo.com"
      }`);
    const testHtml = '<div class="h-entry"><a class="u-arbitrary" href="https://www.duckduckgo.com">DuckDuckGo</a></div>';
    const actual = parser(testHtml,'http://example.org');
    assert.deepEqual(actual,expected);
  });


});