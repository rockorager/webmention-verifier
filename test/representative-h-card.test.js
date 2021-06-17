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
    assert.equal(hcard(data),false);
  });

  it('should return two h-cards if two h-card are sent, nested', function() {
    const data = {
    "items": [{
        "type": ["h-card"],
        "properties": {
            "url": ["http://blog.lizardwrangler.com/"],
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
    console.log(hcard(data));
    assert.deepEqual(hcard(data),data.items[0]);
  });
  
  it('should return one h-card if one h-card is sent, nested', function() {
    const data = {
    "items": [{
      "type": [
        "h-entry"
      ],
      "properties": {
        "published": [
          "2021-06-05 20:18:36+0000"
        ],
        "url": [
          "https://www.timculverhouse.com/notes/2021-06-05-151836.html"
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
          "\"Culverhouse Island\"\n Culverhouse Island"
        ],
        "content": [
          {
            "value": "\"Culverhouse Island\"",
            "html": "<p>\"Culverhouse Island\"\n<img src=\"https://www.timculverhouse.com/assets/img/IMG_0719.jpeg\" alt=\"Culverhouse Island\"></p>\n"
          }
        ]
      }
    }],
    "rels": {},
    "rel-urls": {}
		};
    assert.deepEqual(hcard(data),data.items[0].properties.author[0]);
  });

});