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
    assert.equal(util.validUrl('https://www.duckduckgo.com'), true);
  });
  it('should return false when an invalid url is passed', function() {
    assert.equal(util.validUrl('This is not a URL'), false);
  });
});

describe('util.findTarget()', function() {
  it('should find in-reply-to', function() {
    const jf2 = {'in-reply-to': 'https://www.duckduckgo.com'}
    const res = util.findTarget(jf2, 'https://www.duckduckgo.com');
    assert.equal(res.targetInSource, true);
    assert.equal(res.mention["in-reply-to"], 'https://www.duckduckgo.com');
  });

  it('should find like-of', function() {
    const jf2 = {'like-of': 'https://www.duckduckgo.com'}
    const res = util.findTarget(jf2, 'https://www.duckduckgo.com');
    assert.equal(res.targetInSource, true);
    assert.equal(res.mention["like-of"], 'https://www.duckduckgo.com');
  });

  it('should find repost-of', function() {
    const jf2 = {'repost-of': 'https://www.duckduckgo.com'}
    const res = util.findTarget(jf2, 'https://www.duckduckgo.com');
    assert.equal(res.targetInSource, true);
    assert.equal(res.mention["repost-of"], 'https://www.duckduckgo.com');
  });

  it('should find bookmark-of', function() {
    const jf2 = {'bookmark-of': 'https://www.duckduckgo.com'}
    const res = util.findTarget(jf2, 'https://www.duckduckgo.com');
    assert.equal(res.targetInSource, true);
    assert.equal(res.mention["bookmark-of"], 'https://www.duckduckgo.com');
  });

  it('should find mention-of', function() {
    const jf2 = {'randomProperty': 'https://www.duckduckgo.com'}
    const res = util.findTarget(jf2, 'https://www.duckduckgo.com');
    assert.equal(res.targetInSource, true);
    assert.equal(res.mention["mention-of"], 'https://www.duckduckgo.com');
  });

  it('should return false if target not found', function() {
    const jf2 = {'randomProperty': 'https://www.duckduckgo.com'}
    const res = util.findTarget(jf2, 'not the target');
    assert.equal(res.targetInSource, false);
  });
})