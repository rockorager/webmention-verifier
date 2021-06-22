# webmention-verifier
// add build tags here

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
- ✅ Handle arbitrary microformats (IE `<a class="u-arbitrary" href="http://your-site.com>`)


It **can**: 
- ✅ Check if receiver is a valid resource to accept webmentions for `target` ([should](https://www.w3.org/TR/webmention/#request-verification-p-3))

It **wont**:
- ❌ Process the request asynchronously (more below) ([should](https://www.w3.org/TR/webmention/#receiving-webmentions-p-1))
- ❌ Limit the number of redirects during the `GET` request on `source` ([should](https://www.w3.org/TR/webmention/#webmention-verification-p-3))
- ❌ Store the webmention anywhere
- ❌ Check `source` against a bannedlist

### Inputs
- `source`: (String) URL of the source of the webmention
- `target`: (String) URL of the target of the webmention
- `acceptableHosts`: (Array of strings, optional) domains that are accepted by this webmention receiver. Should not include protocols (`https://`). Example: 
  `['www.timculverhouse.com', 'sub-domain.domain.tld']`

### Outputs

Returns an object with properties:
- `statusCode`: (Numeric) 400 for rejected webmentions, 200 for verified webmentions
- `body`: (String) Description of the status code
- `webmention`: (False || Object) False if rejected, otherwise a [JF2](https://jf2.spec.indieweb.org/) object (see below)

The webmention will be a [JF2](https://jf2.spec.indieweb.org/) object, which will have all discovered microformat properties, as well as:
- `wm-source`: Equal to `source`
- `wm-target`: Equal to `target`
- `wm-property`: Equal to the type of webmention ("in-reply-to","like-of","arbitrary-value")

## Things to do on your end
1. Assign an ID
  [webmention.io](https://webmention.io) uses "wm-id" as the key, and I would stick with that. However you decide to do that is up to you (hash, increment, etc)
2. Store your webmention somewhere
  A database, a file, anywhere.
3. Check if the received webmention already exists, and act accordingly
  In theory, there should only be a single combination of `target` and `source`, so if you already have a mention to a `target` from a `source`, the newly received mention for that combination could be an update, a deletion, or a duplicate send. Don't store two, find the existing mention and act accordingly
4. Return the statusCode and body to the sender

## Future Features
- blocklist