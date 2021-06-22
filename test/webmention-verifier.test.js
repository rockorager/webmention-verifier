var assert = require('assert');
const verifier = require('../lib/webmention-verifier');
const fs = require('fs');
const nock = require('nock');


describe('webmention-verifier', function() {
  
  it('should return status code 400 if the source URL is not valid', async function() {
    const expected={statusCode: 400, body: "Source is not a valid URL", webmention: false};
    const actual = await verifier('Not a url','https://www.duckduckgo.com');
    assert.deepEqual(actual,expected);
  });

  it('should return status code 400 if the target URL is not valid', async function() {
    const expected={statusCode: 400, body: "Target is not a valid URL", webmention: false};
    const actual = await verifier('https://www.duckduckgo.com','Not a url');
    assert.deepEqual(actual,expected);
  });

  it('should return status code 400 if the target URL and source URL are the same', async function() {
    const expected={statusCode: 400,body: "Source and target are same URL", webmention: false};
    const actual = await verifier('https://www.duckduckgo.com','https://www.duckduckgo.com');
    assert.deepEqual(actual,expected);
  });

  it('should return status code 400 if the target domain is not accepted by this receiver', async function() {
    const expected={statusCode: 400,body: "Target domain is not accepted by this server", webmention: false};
    const actual = await verifier('https://www.duckduckgo.com','https://www.google.com',['www.duckduckgo.com']);
    assert.deepEqual(actual,expected);
  });

  it('should return status code 400 if the source url cannot be fetched (does not exist)', async function() {
    const expected={statusCode: 400,body: "Source url does not exist", webmention: false};
    const actual = await verifier('https://www.thisisavalidurlasdfasdfasd21f25sa1d56fasd.com','https://www.duckduckgo.com');
    assert.deepEqual(actual,expected);
  });

  it('should return status code 400 if source does not mention target', async function() {
    const data = fs.readFileSync('./test/data/webmention-verifier-multiple-h-entry.html');
    const scope = nock('https://www.example.com')
      .get('/post.html')
      .reply(200, data);

    const actual = await verifier('https://www.example.com/post.html','https://www.notmentioned.com');
    assert.equal(actual.statusCode,400);
  });
  it('should find in-reply-to', async function() {
    const data = fs.readFileSync('./test/data/webmention-verifier-single-h-entry.html');
    const scope = nock('https://www.example.com')
      .get('/post.html')
      .reply(200, data);

    const actual = await verifier('https://www.example.com/post.html','https://www.duckduckgo.com');
    assert.equal(actual.webmention["in-reply-to"],"https://www.duckduckgo.com");
    assert.equal(actual.webmention["wm-property"],"in-reply-to");
  });

  it('should find in-reply-to with multiple h-entries', async function() {
    const data = fs.readFileSync('./test/data/webmention-verifier-multiple-h-entry.html');
    const scope = nock('https://www.example.com')
      .get('/post.html')
      .reply(200, data);

    const actual = await verifier('https://www.example.com/post.html','https://www.duckduckgo.com');
    assert.equal(actual.webmention["in-reply-to"],"https://www.duckduckgo.com");
    assert.equal(actual.webmention["wm-property"],"in-reply-to");
  });

   it('should find author as William Shakespeare with only p-author', async function() {
    const data = fs.readFileSync('./test/data/webmention-verifier-single-h-entry.html');
    const scope = nock('https://www.example.com')
      .get('/post.html')
      .reply(200, data);

    const actual = await verifier('https://www.example.com/post.html','https://www.duckduckgo.com');
    assert.equal(actual.webmention.author,"William Shakespeare");
  });

   it('should find author as Homer from embedded h-card', async function() {
    const data = fs.readFileSync('./test/data/author-with-embedded-h-card.html');
    const scope = nock('https://www.example.com')
      .get('/post.html')
      .reply(200, data);

    const actual = await verifier('https://www.example.com/post.html','https://www.duckduckgo.com');
    assert.equal(actual.webmention.author.name,"Homer");
  });
  it('should find author as Pata&ntilde;jali from embedded h-card, not from rel-author page', async function() {
    const data = fs.readFileSync('./test/data/author-with-embedded-h-card-and-rel-author.html');
    const scope = nock('https://www.example.com')
      .get('/post.html')
      .reply(200, data);

    const actual = await verifier('https://www.example.com/post.html','https://www.duckduckgo.com');
    assert.equal(actual.webmention.author.name,"Patañjali");
  });

  it('should find author as Virginia Woolf from rel-author page', async function() {
    const data = fs.readFileSync('./test/data/only-rel-author-link.html');
    const data2 = fs.readFileSync('./test/data/virginia-woolf.html');
    const scope = nock('https://www.example.com')
      .get('/post.html')
      .reply(200, data)
      .get('/virginia-woolf.html')
      .reply(200,data2);

    const actual = await verifier('https://www.example.com/post.html','https://www.duckduckgo.com');
    assert.equal(actual.webmention.author.name,"Virginia Woolf");
  });

// LIVE TESTS, MAY BEGIN TO FAIL SOMEDAY
  it('should find author as Webmention Rocks!', async function() {
    const actual = await verifier('https://gregorlove.com/2021/05/i-have-been-using-sublime/','https://www.timculverhouse.com/articles/2021-05-21-text-editors.html');
    assert.equal(actual.webmention.author.name,"gRegor Morrill");
  });

  it('should find author as Webmention Rocks!', async function() {
    const actual = await verifier('https://micro.blog/jean/11454935','https://www.timculverhouse.com/notes/2021-05-15-080000.html');
    assert.equal(actual.webmention.author.name,"jean");
  });

});