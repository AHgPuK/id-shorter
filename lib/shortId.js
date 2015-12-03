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
	var isInverse = true;

	// Setters
	var setBase = function(set) {
		baseCharSet = new Utils.BaseCharSet(set);
	}

	var setEncoding = function(set) {
		encodingCharSet = new Utils.EncodingCharSet(set);
	}


	var setFullId = function(value) {
		isFullId = !!value;
		if (isFullId)
		{
			if (baseCharSet.set == DEFAULT_BASESET)
			{
				baseCharSet = new Utils.BaseCharSet(DEFAULT_FULL_BASESET);
			}
		}
		else
		{
			baseCharSet = new Utils.BaseCharSet(DEFAULT_BASESET);
		}
	}

	var inverse = function(value) {
		isInverse = !!value;
	}

	// Set isFullId first becasuse it changes baseSet to default
	if ('isFullId' in params)
	{
		setFullId(params.isFullId);
	}

	if (params.base)
	{
		setBase(params.base);
	}

	if (params.encoding)
	{
		setEncoding(params.encoding);
	}

	if ('isInverse' in params)
	{
		inverse(params.isInverse);
	}

	var BitStream = function(input, base) {
		var bitBuffer = [];
		var position = 0;

		for (var i = 0; i < input.length; i++)
		{
			var char = input.charAt(i);

			var value = base.map[char];

			if (char == base.escapeChar && (i + 1 < input.length))
			{
				// Escaped char
				var nextChar = input.charAt(++i);
				value = base.set.length + base.map[nextChar];
			}


			if (isNaN(value))
			{
				console.error('Invalid char "' + char + '" in input');
				// Clear buffer
				bitBuffer = [];
				break;
			}

			var bitValue = Utils.padLeft(value.toString(2), base.bits, '0');

			// console.log(value + ' | ' + baseBits + ' | ' + bitValue);

			bitBuffer = bitBuffer.concat(bitValue.split(''));
		}
		// console.log('BitBuffer:', bitBuffer);

		var stream = {
			rewind: function() {
				position = 0;
			},
			isEOF: function() {
				return position == bitBuffer.length;
			},
			getBits: function(bits) {
				if (stream.isEOF())
				{
					return;
				}

				var requestedBits = bitBuffer.slice(position, position + bits).join('');
				position += requestedBits.length;
				var value = parseInt(requestedBits, 2);

				return value;
			},
		}

		return stream;
	}


	return {
		//setFullId: setFullId,
		//setBase: setBase,
		//setEncoding: setEncoding,
		//inverse: inverse,
		encode: function(input) {

			if (!isFullId && baseCharSet.set == DEFAULT_BASESET)
			{
				input = Utils.getObjectIdTime(input);
			}

			var bitStream = BitStream(String(input), baseCharSet);

			var result = '';
			while (!bitStream.isEOF())
			{
				var value = bitStream.getBits(encodingCharSet.bits);
				var nextChar = encodingCharSet.encode(value);
				if (isInverse)
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
		decode: function(input) {

			if (isInverse)
			{
				if (encodingCharSet.escapeChar !== undefined)
				{
					var reverseStr = '';
					var pos = 0;
					while (pos < input.length)
					{
						var char = input.charAt(pos++);
						if (char == encodingCharSet.escapeChar)
						{
							char += input.charAt(pos++);
						}

						reverseStr = char + reverseStr;
					}
					input = reverseStr;
				}
				else
				{
					input = input.split().reverse().join();
				}
			}

			var bitStream = BitStream(String(input), encodingCharSet);

			var result = '';
			while (!bitStream.isEOF())
			{
				var value = bitStream.getBits(baseCharSet.bits);
				var char = baseCharSet.set.charAt(value);
				result += char;
			}

			return result;

		}
	};
}
