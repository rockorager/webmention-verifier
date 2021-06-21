var assert = require('assert');
const hcard = require('../lib/representative-h-card');

describe('representative-h-card()', function() {
  it('should return false if no hcards are found', function() {
    const data = {
    "items": [{
	        "type": ["h-entry"],
	        "properties": {
	            "name": ["microformats.org at 7"]
	        }
	    }],
	    "rels": {},
	    "rel-urls": {}
	};
    assert.equal(hcard(data,''),false);
  });

  it('should return one h-card if two h-card are found (one is nested) with url and uid on the first one', function() {
    const data = {
    "items": [{
        "type": ["h-card"],
        "properties": {
            "url": ["http://blog.lizardwrangler.com/"],
            "uid": ["http://blog.lizardwrangler.com/"],
            "name": ["Mitchell Baker"],
            "org": [{
                "value": "Mozilla Foundation",
                "type": ["h-card"],
                "properties": {
                    "name": ["Mozilla Foundation"],
                    "url": ["http://mozilla.org/"]
                }
            }]
        }
    }],
    "rels": {},
    "rel-urls": {}
		};
    assert.deepEqual(hcard(data,"http://blog.lizardwrangler.com/"),data.items[0]);
  });

    it('should return one h-card if two h-card are found (one is nested) with url and uid on the second one', function() {
    const data = {
    "items": [{
        "type": ["h-card"],
        "properties": {
            "url": ["http://blog.lizardwrangler.com/"],
            "uid": ["http://blog.lizardwrangler.com/"],
            "name": ["Mitchell Baker"],
            "org": [{
                "value": "Mozilla Foundation",
                "type": ["h-card"],
                "properties": {
                    "name": ["Mozilla Foundation"],
                    "url": ["http://mozilla.org/"],
                    "uid": ["http://mozilla.org/"]
                }
            }]
        }
    }],
    "rels": {},
    "rel-urls": {}
    };
    assert.deepEqual(hcard(data,"http://mozilla.org/"),data.items[0].properties.org[0]);
  });
  
  it('should return one (nested) h-card with url and uid', function() {
    const data = {
    "items": [{
      "type": [
        "h-entry"
      ],
      "properties": {
        "url": [
          "https://www.timculverhouse.com/notes/this-is-not-a-real-url.html"
        ],
        "author": [
          {
            "value": "Tim Culverhouse",
            "type": [
              "h-card"
            ],
            "properties": {
              "name": [
                "Tim Culverhouse"
              ],
              "photo": [
                "https://www.timculverhouse.com/assets/img/tim-avatar.jpeg"
              ],
              "url": [
                "https://www.timculverhouse.com"
              ],
              "uid": [
                "https://www.timculverhouse.com"
              ]
            }
          }
        ],
        "name": [
          "Not a real post"
        ],
        "content": [
          {
            "value": "Not a real post",
            "html": "<p>This is just for testing</p>"
          }
        ]
      }
    }],
    "rels": {},
    "rel-urls": {}
		};
    assert.deepEqual(hcard(data, 'https://www.timculverhouse.com'),data.items[0].properties.author[0]);
  });

  it('should return one (nested) h-card with url and rel-me', function() {
    const data = {
    "items": [{
      "type": [
        "h-entry"
      ],
      "properties": {
        "url": [
          "https://www.timculverhouse.com/notes/this-is-not-a-real-url.html"
        ],
        "author": [
          {
            "value": "Tim Culverhouse",
            "type": [
              "h-card"
            ],
            "properties": {
              "name": [
                "Tim Culverhouse"
              ],
              "photo": [
                "https://www.timculverhouse.com/assets/img/tim-avatar.jpeg"
              ],
              "url": [
                "https://www.timculverhouse.com"
              ]
            }
          }
        ],
        "name": [
          "Not a real post"
        ],
        "content": [
          {
            "value": "Not a real post",
            "html": "<p>This is just for testing</p>"
          }
        ]
      }
    }],
    "rels": {
      "me": [
                "https://www.timculverhouse.com"
              ]
    },
    "rel-urls": {}
    };
    assert.deepEqual(hcard(data, 'https://www.timculverhouse.com'),data.items[0].properties.author[0]);
  });

  it('should return one h-card if two h-card are found (one is nested) with url on the first one which matches target', function() {
    const data = {
    "items": [{
        "type": ["h-card"],
        "properties": {
            "url": ["http://blog.lizardwrangler.com/"],
            "uid": ["http://blog.lizardwrangler.com/"],
            "name": ["Mitchell Baker"],
            "org": [{
                "value": "Mozilla Foundation",
                "type": ["h-card"],
                "properties": {
                    "name": ["Mozilla Foundation"],
                    "url": ["http://mozilla.org/"]
                }
            }]
        }
    }],
    "rels": {},
    "rel-urls": {}
    };
    assert.deepEqual(hcard(data,"http://blog.lizardwrangler.com/"),data.items[0]);
  });

});