var Utils = require('./utils');

var DEFAULT_BASESET = '0123456789';
var DEFAULT_FULL_BASESET = '0123456789abcdef';
var DEFAULT_ENCODINGSET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

module.exports = function(params) {

	params = params || {};

	// Defaut encoding
	var baseCharSet = new Utils.BaseCharSet(DEFAULT_BASESET);
	var encodingCharSet = new Utils.EncodingCharSet(DEFAULT_ENCODINGSET);
	var isFullId = false;
	var isReverse = true;

	// Setters
	var setBase = function(set)
	{
		baseCharSet = new Utils.BaseCharSet(set);
	}

	var setEncoding =  function(set)
	{
		encodingCharSet = new Utils.EncodingCharSet(set);
	}


	var setFullId = function(value)
	{
		isFullId = !!value;
		if(isFullId)
		{
			if(baseCharSet.set == DEFAULT_BASESET)
			{
				baseCharSet = new Utils.BaseCharSet(DEFAULT_FULL_BASESET);
			}
		}
		else
		{
			baseCharSet = new Utils.BaseCharSet(DEFAULT_BASESET);
		}
	}

	var reverse = function(value) {
		isReverse = !!value;
	}

	// Set isFullId first becasuse it changes baseSet to default
	if ('isFullId' in params)
	{
		setFullId(params.isFullId);
	}

	if(params.base)
	{
		setBase(params.base);
	}

	if(params.encoding)
	{
		setEncoding(params.encoding);
	}

	if ('isReverse' in params)
	{
		reverse(params.isReverse);
	}

	var bitBuffer = [];
	var position = 0;

	var BitStream = {
		init: function(input) {
			bitBuffer = [];
			position = 0;

			for (var i = 0; i < input.length; i++)
			{
				var char = input.charAt(i);
				var value = baseCharSet.map[char];

				if (isNaN(value))
				{
					console.error('Invalid char "' + char + '" in input');
					return '';
				}

				var bitValue = Utils.padLeft(value.toString(2), baseCharSet.bits, '0');

				// console.log(value + ' | ' + baseBits + ' | ' + bitValue);

				bitBuffer = bitBuffer.concat(bitValue.split(''));
			}
			// console.log('BitBuffer:', bitBuffer);
		},
		rewind: function() {
			position = 0;
		},
		isEOF: function() {
			return position == bitBuffer.length;
		},
		getBits: function(bits) {
			if (BitStream.isEOF())
			{
				return;
			}

			var requestedBits = bitBuffer.slice(position, position + bits).join('');
			position += requestedBits.length;
			var value = parseInt(requestedBits, 2);
			var result = encodingCharSet.encode(value);

			return result;
		},
	}

	return {
		setFullId: setFullId,
		setBase: setBase,
		setEncoding: setEncoding,
		reverse: reverse,
		encode: function(input) {

			if(!isFullId)
			{
				input = Utils.getObjectIdTime(input);
			}

			BitStream.init(String(input));

			var result = '';
			while (!BitStream.isEOF())
			{
				var nextChar = BitStream.getBits(encodingCharSet.bits);
				if(isReverse)
				{
					result = nextChar + result;
				}
				else
				{
					result += nextChar;
				}
			}

			return result;
		},
	};
}
