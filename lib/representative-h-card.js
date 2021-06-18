// Nodejs rewrite of https://github.com/indieweb/representative-h-card-php/blob/master/src/mf2/representative-h-card.php

module.exports = function (mf2, target) {
	
	const cards = findHCards(mf2);

	if (cards.length === 0) {
		return false;
	} 

	// If the page contains an h-card with uid and url properties both matching
  	// the page URL, the first such h-card is the representative h-card
	var card = cards.find(function (card){
		return hasProperty(card, 'url', target) && hasProperty(card, 'uid', target);
		}); 

	if(card) {
		return card;
	}

	// If no representative h-card was found, if the page contains an h-card with
	// a url property value which also has a rel=me relation (i.e. matches a URL
	// in parse_results.rels.me), the first such h-card is the representative h-card

	card = cards.find(function(card){
		if(card.properties.hasOwnProperty('url') && mf2.hasOwnProperty('rels') && mf2.rels.hasOwnProperty('me')) {
			return card.properties.url.some(function(url){
				return mf2.rels.me.includes(url);
			});
		}
	});

	if(card) {
		return card;
	}

  // If no representative h-card was found, if the page contains one single
  // h-card with a url property matching the page URL, that h-card is the
  // representative h-card
  	if(cards.length === 1) {
  		if(hasProperty(cards[0],'url',target)) {
  			return cards[0];
  		}
  	}


	return false;
};

// Return a flattened list of all h-cards on the page at any depth
function findHCards (mf2, cards) {
	
	cards = cards || [];

	if (isMicroformat(mf2)){
		if(mf2.type.indexOf('h-card') >= 0) {
			cards.push(mf2);
		}
		for (var property in mf2.properties) {
			if (isMicroformat(mf2.properties[property])) {
				cards = findHCards(mf2.properties[property],cards);
			} else if (hasObjects(mf2.properties[property])) {
				mf2.properties[property].forEach(function (item){
					cards = findHCards(item, cards);
				});
			}
		}
	} else if (isMicroformatCollection(mf2)){
		mf2.items.forEach(function (item){
			cards = findHCards(item, cards);
		});
	}
	return cards;
}

function hasObjects (arr) {
	let hasAnObject = false;
	arr.forEach(function(item){
		if(typeof item === 'object') {
			hasAnObject = true;
		}
	});
	return hasAnObject;
}

function isMicroformat(mf2) {
	return mf2.hasOwnProperty('type');
}

function isMicroformatCollection(mf2) {
	return mf2.hasOwnProperty('items');
}

function hasProperty(card, property, value) {
	try {
		return card.properties[property].includes(value);
	} catch {
		return false;
	}
}