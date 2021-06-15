var assert = require('assert');
const verifier = require('../lib/webmention-verifier');


describe('webmention-verifier', function() {
  
  it('should return status code 400 if the source URL is not valid', async function() {
    const expected={statusCode: 400, body: "Source is not a valid URL"};
    const actual = await verifier('Not a url','https://www.duckduckgo.com');
    assert.deepEqual(actual,expected);
  });

  it('should return status code 400 if the target URL is not valid', async function() {
    const expected={statusCode: 400, body: "Target is not a valid URL"};
    const actual = await verifier('https://www.duckduckgo.com','Not a url');
    assert.deepEqual(actual,expected);
  });

  it('should return status code 400 if the target URL and source URL are the same', async function() {
    const expected={statusCode: 400,body: "Source and target are same URL"};
    const actual = await verifier('https://www.duckduckgo.com','https://www.duckduckgo.com');
    assert.deepEqual(actual,expected);
  });

  it('should return status code 400 if the target domain is not accepted by this receiver', async function() {
    const expected={statusCode: 400,body: "Target domain is not accepted by this server",};
    const actual = await verifier('https://www.duckduckgo.com','https://www.google.com','www.duckduckgo.com');
    assert.deepEqual(actual,expected);
  });

  it('should return status code 400 if the target domain cannot be fetched (does not exist)', async function() {
    const expected={statusCode: 400,body: "Target domain does not exist",};
    const actual = await verifier('https://www.duckduckgo.com','https://www.thisisavalidurlasdfasdfasd21f25sa1d56fasd.com');
    assert.deepEqual(actual,expected);
  });



})