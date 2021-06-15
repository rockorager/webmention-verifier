var assert = require('assert');
const verifier = require('../lib/webmention-verifier');


describe('webmention-verifier', function() {
  
  it('should return status code 400 if the source URL is not valid', function() {
    const expected={statusCode: 400, body: "Source is not a valid URL"};
    const actual = verifier('Not a url','https://www.duckduckgo.com');
    assert.deepEqual(actual,expected);
  });

  it('should return status code 400 if the target URL is not valid', function() {
    const expected={statusCode: 400, body: "Target is not a valid URL"};
    const actual = verifier('https://www.duckduckgo.com','Not a url');
    assert.deepEqual(actual,expected);
  });

  it('should return status code 400 if the target URL and source URL are the same', function() {
    const expected={statusCode: 400,body: "Source and target are same URL"};
    const actual = verifier('https://www.duckduckgo.com','https://www.duckduckgo.com');
    assert.deepEqual(actual,expected);
  });

  it('should return status code 400 if the target domain is not accepted by this receiver', function() {
    const expected={statusCode: 400,body: "Target domain is not accepted by this server",};
    const actual = verifier('https://www.google.com','https://www.duckduckgo.com','duckduckgo.com');
    assert.deepEqual(actual,expected);
  });


})