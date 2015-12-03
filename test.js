var ObjectId = require('bson').ObjectId;

var ShortId = require('./index.js');
var mongoDBShortId = ShortId();

console.log('Default configuration: very short mongoDB object Id');
for (var i = 0; i < 2; i++)
{
	var testObjectId = new ObjectId();
	var result = mongoDBShortId.encode(testObjectId);
	console.log(testObjectId + ' = ' + result);
}

var shortId = ShortId({
	isFullId: true
});
console.log('\nUse full ObjectId value with reverse possibility');

for (var i = 0; i < 2; i++)
{
	var testObjectId = new ObjectId();
	var result = shortId.encode(testObjectId);
	console.log(testObjectId + ' = ' + result);
}

console.log('\nTest reversible decoding');
var decodeResult = shortId.decode(result);
console.log(result + ' = ' + decodeResult);

var result = 'xk4pZ11XpLsWPy1Cl';
var decodeResult = shortId.decode(result);
console.log(result + ' = ' + decodeResult + '(566062cfa72f67b07e644521)');

console.log('\nTest absolutely custom config');

var Bin2Hex = ShortId({
	base: '01',
	encoding: '0123456789abcdef',
	isInverse: false,
	//isFullId: true,
});

var sourceValue = '0000000100100011010001010110011110001001101010111100110111101111'
var result = Bin2Hex.encode(sourceValue);
console.log('Binary to HEX:', sourceValue + ' = ' + result);

var Bin2Hex = ShortId({
	base: '01',
	encoding: '0123456789abcdef',
	isInverse: true,
	//isFullId: true, // No need - base set is not by default
});

var sourceValue = '0000000100100011010001010110011110001001101010111100110111101111'
var result = Bin2Hex.encode(sourceValue);
console.log('Binary to HEX:', sourceValue + ' = ' + result);

