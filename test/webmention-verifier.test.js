var assert = require('assert');
const verifier = require('../lib/webmention-verifier');
const fs = require('fs');
const nock = require('nock');


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

  it('should return status code 400 if the source url cannot be fetched (does not exist)', async function() {
    const expected={statusCode: 400,body: "Source url does not exist",};
    const actual = await verifier('https://www.thisisavalidurlasdfasdfasd21f25sa1d56fasd.com','https://www.duckduckgo.com');
    assert.deepEqual(actual,expected);
  });

  it('should return status code 400 if source does not mention target', async function() {
    const data = fs.readFileSync('./test/data/webmention-verifier-multiple-h-entry.html')
    const scope = nock('https://www.example.com')
      .get('/post.html')
      .reply(200, data)

    const actual = await verifier('https://www.example.com/post.html','https://www.notmentioned.com');
    assert.equal(actual.statusCode,400)
  });
  it('should find in-reply-to', async function() {
    const data = fs.readFileSync('./test/data/webmention-verifier-single-h-entry.html')
    const scope = nock('https://www.example.com')
      .get('/post.html')
      .reply(200, data)

    const actual = await verifier('https://www.example.com/post.html','https://www.duckduckgo.com');
    assert.equal(actual["in-reply-to"],"https://www.duckduckgo.com")
  });

  it('should find in-reply-to with multiple h-entries', async function() {
    const data = fs.readFileSync('./test/data/webmention-verifier-multiple-h-entry.html')
    const scope = nock('https://www.example.com')
      .get('/post.html')
      .reply(200, data)

    const actual = await verifier('https://www.example.com/post.html','https://www.duckduckgo.com');
    assert.equal(actual["in-reply-to"],"https://www.duckduckgo.com")
  });

// test for jf2 children array
// test for jf2 card in array
// test(s?) for adding author if h-card not there


})