// Nodejs rewrite of https://github.com/indieweb/representative-h-card-php/blob/master/src/mf2/representative-h-card.php

module.exports = function (mf2) {
	
	const cards = findHCards(mf2);
	console.log(cards);
	if (cards.length === 0) {
		return false;
	} else if (cards.length === 1) {
		return cards[0];
	} else {
		return cards[0];
	}

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