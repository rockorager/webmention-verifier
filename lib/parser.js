const mf2Parser = require('microformat-node');
const cheerio = require('cheerio');

// from @paulrobertlloyd/mf2tojf2
const flattenProperties = object => {
  const newObject = {};

  // Update `type` property, eg `h-entry` => `entry`
  newObject.type = object.type[0].split('-').slice(1)[0];

  // Flatten values in `properties`
  for (const property in object.properties) {
    if (Object.prototype.hasOwnProperty.call(object.properties, property)) {
      newObject[property] = flattenItems(object.properties[property]);
    }
  }

  // Flatten values in `children`
  if (object.children) {
    const {children} = object;
    newObject.children = children.map(child => flattenItems(child, true));
  }

  // Return updated object
  return newObject;
};

/**
 * Create object with `html` and `text` values
 *
 * @see {@link https://jf2.spec.indieweb.org/#html-content}
 * @param {object} item URL
 * @returns {object} String is a URL
 */
const getHtml = item => ({
  html: item.html,
  ...(item.value && {text: item.value})
});

/**
 * Create object with `children` value
 *
 * @see {@link https://jf2.spec.indieweb.org/#collections}
 * @param {Array} items MF2
 * @returns {Array} JF2
 */
const getChildren = items => ({
  children: items.map(item => flattenItems(item))
});

/**
 * Create object with `children` array
 *
 * @param {Array} items MF2
 * @param {boolean} returnChildren Return `children` property
 * @returns {object} JF2
 */
const flattenItems = (items, returnChildren = false) => {
  if (!Array.isArray(items)) {
    items = new Array(items);
  }

  if (items.length === 0) {
    return {};
  }

  if (items.length === 1) {
    const item = items[0];

    if (typeof item === 'string' || typeof item === 'number') {
      return item;
    }

    // Child object
    if (Object.prototype.hasOwnProperty.call(item, 'type')) {
      return flattenProperties(item);
    }

    // Content object
    if (Object.prototype.hasOwnProperty.call(item, 'html')) {
      return getHtml(item);
    }

    // Media object with single item
    if (Object.prototype.hasOwnProperty.call(item, 'value')) {
      item.url = item.value;
      delete item.value;
      return [item];
    }
  }

  if (items.length > 1) {
    const item = items[0];

    // Child object
    if (Object.prototype.hasOwnProperty.call(item, 'type') || returnChildren) {
      return getChildren(items);
    }

    // Media object with multiple items
    items.forEach(item => {
      if (Object.prototype.hasOwnProperty.call(item, 'value')) {
        item.url = item.value;
        delete item.value;
        return item;
      }
    });
  }

  return items;
};

// returns an mf2 object given html and source
function mf2 (html, source) {
  const parsed = cheerio.load(html);
	const baseURL = new URL(source).origin;
	const options = {
		node: parsed,
		baseUrl: baseURL,
	};
  
  const parsedMf2 = mf2Parser.get(options);
  // no microformats, add attribs from any sort of link to items
    
  let links = [];
  let domLinks = parsed('a');
  for(let i=0; i<domLinks.length; i++) {
    // find all links on page
    links.push(domLinks[i].attribs.href);
  }
  let link = {
    type: ["h-mention-of"],
    properties: {
      'mention-of': links
    }
  };
  parsedMf2.items.push(link);
	return parsedMf2;

}

// Converts mf2 object to jf2 object
function mf2tojf2 (mf2) {
  return flattenItems(mf2.items);
}

// Returns a jf2 object given html and source
function jf2 (html, source) {
  const parsedMf2 = mf2(html, source);
  return flattenItems(parsedMf2.items);

}

module.exports = {
  mf2,
  jf2,
  mf2tojf2,
  flattenProperties
};