var assert = require('assert');
const util = require('../lib/util');


describe('util.fetchHtml()', async function() {
  it('should return true if the URL exists', async function() {
    const res = await util.fetchHtml('https://berkshirehathaway.com/');
    assert.ok(typeof res === 'string');
  });
  it('should return false if the URL does not exist', async function() {
    const res = await util.fetchHtml('Not a url');
    assert.equal(res, false);
  });
});

describe('util.validUrl()', function(){
  it('should return true when a valid url is passed', function() {
    assert.equal(util.isUrl('https://www.duckduckgo.com'), true);
  });
  it('should return false when an invalid url is passed', function() {
    assert.equal(util.isUrl('This is not a URL'), false);
  });
});

describe('util.findTarget()', function() {
  it('should find in-reply-to', function() {
    const jf2 = {"in-reply-to": "https://www.duckduckgo.com","content": {"html": "<a href=\"https:\/\/www.duckduckgo.com\" class=\"u-in-reply-to\">duckduckgo</a>"}};
    const res = util.findTarget(jf2, 'https://www.duckduckgo.com');
    assert.equal(res.targetInSource, true);
    assert.equal(res.mention["in-reply-to"], 'https://www.duckduckgo.com');
    assert.equal(res.mention["wm-property"], 'in-reply-to');
  });

  it('should find like-of', function() {
    const jf2 = {"like-of": "https://www.duckduckgo.com","content": {"html": "<a href=\"https:\/\/www.duckduckgo.com\" class=\"u-like-of\">duckduckgo</a>"}}
    const res = util.findTarget(jf2, 'https://www.duckduckgo.com');
    assert.equal(res.targetInSource, true);
    assert.equal(res.mention["like-of"], 'https://www.duckduckgo.com');
    assert.equal(res.mention["wm-property"], 'like-of');
  });

  it('should find repost-of', function() {
    const jf2 = {'repost-of': 'https://www.duckduckgo.com'};
    const res = util.findTarget(jf2, 'https://www.duckduckgo.com');
    assert.equal(res.targetInSource, true);
    assert.equal(res.mention["repost-of"], 'https://www.duckduckgo.com');
    assert.equal(res.mention["wm-property"], 'repost-of');
  });

  it('should find bookmark-of', function() {
    const jf2 = {'bookmark-of': 'https://www.duckduckgo.com'};
    const res = util.findTarget(jf2, 'https://www.duckduckgo.com');
    assert.equal(res.targetInSource, true);
    assert.equal(res.mention["bookmark-of"], 'https://www.duckduckgo.com');
    assert.equal(res.mention["wm-property"], 'bookmark-of');
  });

  it('should find mention-of', function() {
    const jf2 = {"content": {"html": "<a href=\"https:\/\/www.duckduckgo.com\">duckduckgo</a>"}};
    const res = util.findTarget(jf2, 'https://www.duckduckgo.com');
    assert.equal(res.targetInSource, true);
    assert.equal(res.mention["mention-of"], 'https://www.duckduckgo.com');
    assert.equal(res.mention["wm-property"], 'mention-of');
  });

  it('should find arbitrary', function() {
    const jf2 = {"arbitrary": "https://www.duckduckgo.com","content": {"html": "<a href=\"https:\/\/www.duckduckgo.com\" class=\"u-arbitrary\">duckduckgo</a>"}};;
    const res = util.findTarget(jf2, 'https://www.duckduckgo.com');
    assert.equal(res.targetInSource, true);
    assert.equal(res.mention["arbitrary"], 'https://www.duckduckgo.com');
    assert.equal(res.mention["wm-property"], 'arbitrary');
  });

  it('should return false if target not found', function() {
    const jf2 = {"content": {"html": "<a href=\"https:\/\/www.duckduckgo.com\">duckduckgo</a>"}};
    const res = util.findTarget(jf2, 'not the target');
    assert.equal(res.targetInSource, false);
  });

  it('should find link', function() {
    const jf2 = {"link": ["https://www.duckduckgo.com"]};
    const res = util.findTarget(jf2, 'https://www.duckduckgo.com');
    assert.equal(res.targetInSource, true);
    assert.equal(res.mention["link"], 'https://www.duckduckgo.com');
    assert.equal(res.mention["wm-property"], 'link');
  });
});