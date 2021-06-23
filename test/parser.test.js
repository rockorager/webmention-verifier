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

    const actual = parser.jf2(testHtml,'http://example.org');
    assert.deepEqual(actual.children[0],expected);
  });

  it('should parse u-in-reply-to', function() {
    expected = JSON.parse(`
      { 
        "in-reply-to": "https://www.duckduckgo.com",
        "name": "DuckDuckGo",
        "type": "entry",
        "url": "https://www.replying-to-ddg.com"
      }`);
    const testHtml = '<div class="h-entry"><a class="u-url" href="https://www.replying-to-ddg.com"></a><a class="u-in-reply-to" href="https://www.duckduckgo.com">DuckDuckGo</a></div>';
    const actual = parser.jf2(testHtml,'https://www.replying-to-ddg.com');
    assert.deepEqual(actual.children[0],expected);
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
    const actual = parser.jf2(testHtml,'https://www.duckduckgo.com');
    assert.deepEqual(actual.children[0],expected);
  });

  it('should parse u-arbitrary when in <img> tag', function() {
    expected = JSON.parse(`
      { 
        "arbitrary": "https://www.duckduckgo.com",
        "type": "entry",
        "photo": "https://www.duckduckgo.com"
      }`);
    const testHtml = '<div class="h-entry"><img class="u-arbitrary" src="https://www.duckduckgo.com"></div>';
    const actual = parser.jf2(testHtml,'https://www.duckduckgo.com');
    assert.deepEqual(actual.children[0],expected);
  });

it('should parse u-in-reply-to with an rsvp', function() {
    expected = JSON.parse(`
      { 
        "in-reply-to": "https://www.duckduckgo.com",
        "name": "DuckDuckGo",
        "type": "entry",
        "url": "https://www.duckduckgo.com",
        "rsvp": "yes"
      }`);
    const testHtml = '<div class="h-entry"><a class="u-in-reply-to" href="https://www.duckduckgo.com">DuckDuckGo</a><data class="p-rsvp" value="yes"></data></div>';
    const actual = parser.jf2(testHtml,'https://www.duckduckgo.com');
    assert.deepEqual(actual.children[0],expected);
  });

it('return an mf2 object with property links', function() {
    const testHtml = '<div><a href="https://www.duckduckgo.com">DuckDuckGo</a><a href="/another-link">Link</a></div>';
    const res = parser.jf2(testHtml,'https://www.duckduckgo.com');
    assert.equal(res["mention-of"].includes("https://www.duckduckgo.com"),true);
  });

});