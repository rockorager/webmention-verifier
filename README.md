# webmention-verifier
A Node.js webmention verifier

## Installation

```bash
npm install webmention-verifier
```

## Usage    

Webmention Verifier will mostly verify webmentions per the [W3c specification](https://www.w3.org/TR/webmention/). Mostly.

```js
const wmverifier = require('webmention-verifier');

const webmention = wmverifier(source, target[, acceptableHosts]);
```

It **will**:
- ✅ Verify that `source` and `target` are valid URLs ([must](https://www.w3.org/TR/webmention/#request-verification-p-1))
- ✅ Reject the request if `source` and `target` are not the same URL ([must](https://www.w3.org/TR/webmention/#request-verification-p-2))
- ✅ Perform a `GET` request on `source` **and** confirm `source` mentions `target` ([must](https://www.w3.org/TR/webmention/#request-verification-p-2))
- ✅ Handle arbitrary microformats (IE `<a class="u-arbitrary" href="http://your-site.com">`)
- ✅ Handle sources with no microformats (added in v1.1)


It **can**: 
- ✅ Check if receiver is a valid resource to accept webmentions for `target` ([should](https://www.w3.org/TR/webmention/#request-verification-p-3))

It **wont**:
- ❌ Process the request asynchronously (more below) ([should](https://www.w3.org/TR/webmention/#receiving-webmentions-p-1))
- ❌ Limit the number of redirects during the `GET` request on `source` ([should](https://www.w3.org/TR/webmention/#webmention-verification-p-3))
- ❌ Store the webmention anywhere
- ❌ Check `source` against a blocklist (I will add this at some point)

### Inputs
- `source`: (String) URL of the source of the webmention
- `target`: (String) URL of the target of the webmention
- `acceptableHosts`: (Array of strings, optional) domains that are accepted by this webmention receiver. Should not include protocols (`https://`). Example: 
  `['www.timculverhouse.com', 'timculverhouse.com', 'sub-domain.domain.tld']`

### Outputs

Returns an object with properties:
- `statusCode`: (Numeric) 400 for rejected webmentions, 200 for verified webmentions
- `body`: (String) Description of the status code
- `webmention`: (False || Object) False if rejected, otherwise a [JF2](https://jf2.spec.indieweb.org/) object (see below)

The webmention will be a [JF2](https://jf2.spec.indieweb.org/) object, which will have all discovered microformat properties, as well as:
- `wm-source`: Equal to `source`
- `wm-target`: Equal to `target`
- `wm-property`: Equal to the type of webmention ("in-reply-to","like-of","arbitrary-value")

### Synchronous vs Asynchronous processing
This verifier does all it's check synchronously. This is not recommended by the spec, but it is not capable of knowing how to form a location URL for you to respond to the sender with. So it doesn't do that.

It would be possible to add an option to have the verifier respond in an async matter (do what it can without fetching, respond with a code, and you handle the location URL crafting on your end while it finishes up verification);.

## Example

HTML (`source` = https://www.example.com/post.html, `target` = "https://www.duckduckgo.com"):
```html
<html>
  <head>
    <title>Single h-Entry</title>
  </head>
  <body>
    <article class="h-entry">
      <h1 class="p-name">Article Title</h1>
      <section class="e-content">
      <a href="https://www.duckduckgo.com" class="u-in-reply-to">DuckDuckgo</a>
      This is some content
    </section>
    </article>
    <a href="https://www.example.com/virginia-woolf.html" rel="author">about Virginia Woolf</a>
  </body>
</html>
```
Javascript:
```js
const wmverifier = require('webmention-verifier');

const res = wmverifier('https://www.example.com/some-post', 'https://www.duckduckgo.com');

console.log(res);
/* Output
{
  statusCode: 200,
  body: 'Webmention verified',
  webmention: {
    type: 'entry',
    name: 'Article Title',
    content: {
      html: '\n' +
        '      <a href="https://www.duckduckgo.com" class="u-in-reply-to">DuckDuckgo</a>\n' +
        '      This is some content\n' +
        '    ',
      text: 'DuckDuckgo\n      This is some content'
    },
    'in-reply-to': 'https://www.duckduckgo.com',
    'wm-property': 'in-reply-to',
    'wm-target': 'https://www.duckduckgo.com',
    'wm-source': 'https://www.example.com/post.html',
    'wm-received': '2021-06-22T14:28:25.229Z',
    author: {
      type: 'card',
      url: 'https://www.example.com/virginia-woolf.html',
      photo: 'https://www.example.com/images/virginia-woolf.jpg',
      name: 'Virginia Woolf'
    }
  }
}
*/
```

If we change the call to wmverifierto be a different `target` to trigger a rejection, we get:
```js
var res = wmverifier('https://www.example.com/some-post', 'https://www.not-mentioned.com');

console.log(res);
/* Output
{
  statusCode: 400,
  body: 'Source does not mention target',
  webmention: false
}
*/
```

## Things to do on your end
1. Assign an ID
  [webmention.io](https://webmention.io) uses "wm-id" as the key, and I would stick with that. However you decide to do that is up to you (hash, increment, etc)
2. Store your webmention somewhere
  A database, a file, anywhere.
3. Check if the received webmention already exists, and act accordingly
  In theory, there should only be a single combination of `target` and `source`, so if you already have a mention to a `target` from a `source`, the newly received mention for that combination could be an update, a deletion, or a duplicate send. Don't store two, find the existing mention and act accordingly
4. Return the statusCode and body to the sender

## Future Features
- blocklist support
- pingback support