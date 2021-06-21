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

const webmention = wmverifier(source, target[, acceptableHost])
```

It **will**:
✅ Verify that `source` and `target` are valid URLs ([must](https://www.w3.org/TR/webmention/#request-verification-p-1))
✅ Reject the request if `source` and `target` are not the same URL ([must](https://www.w3.org/TR/webmention/#request-verification-p-2))
✅ Perform a `GET` request on `source` **and** confirm `source` mentions `target` ([must](https://www.w3.org/TR/webmention/#request-verification-p-2))
✅ Handle arbitrary microformats (IE `<a class="u-arbitrary" href="http://your-site.com>`)


It **can**: 
✅ Check if receiver is a valid resource to accept webmentions for `target` ([should](https://www.w3.org/TR/webmention/#request-verification-p-3))

It **wont**:
❌ Process the request asynchronously (more below) ([should](https://www.w3.org/TR/webmention/#receiving-webmentions-p-1))
❌ Return a status code for success (your code needs to handle this part)
❌ Limit the number of redirects during the `GET` request on `source` ([should](https://www.w3.org/TR/webmention/#webmention-verification-p-3))
❌ Store the webmention anywhere
❌ Check `source` against a bannedlist

### Inputs
- `source`: (String) URL of the source of the webmention
- `target`: (String) URL of the target of the webmention
- `acceptableHost`: (String, optional) domains that are accepted by this webmention receiver. Should not include protocols (`https://`). Example: `www.timculverhouse.com`, `sub-domain.domain.tld`

### Outputs

Returns an object with properties:
- `statusCode`: (Numeric) 400 for rejected webmentions, 200 for verified webmentions
- `body`: (String) Description of the status code
- `webmention`: False if rejected, otherwise a [JF2](https://jf2.spec.indieweb.org/) object (see below)

The webmention will be a [JF2](https://jf2.spec.indieweb.org/) object, which will have all of the microformat properties included, as well as:
- `wm-source`: Equal to `source`
- `wm-target`: Equal to `target`
- `wm-property`: Equal to the type of webmention ("in-reply-to","like-of","arbitrary-value")

### Example