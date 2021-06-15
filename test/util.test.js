var assert = require('assert');
const util = require('../lib/util');


describe('#fetchHtml()', async function() {
  it('should return true if the URL exists', async function() {
    const res = await util.fetchHtml('https://www.duckduckgo.com');
    assert.ok(typeof res === 'string');
  });
  it('should return false if the URL does not exist', async function() {
    const res = await util.fetchHtml('Not a url');
    assert.equal(res, false);
  });
});

describe('#validUrl()', function(){
  it('should return true when a valid url is passed', function() {
    assert.equal(util.validUrl('https://www.duckduckgo.com'), true);
  });
  it('should return false when an invalid url is passed', function() {
    assert.equal(util.validUrl('This is not a URL'), false);
  });
});