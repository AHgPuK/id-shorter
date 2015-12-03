var ObjectId = require('bson').ObjectId;

exports.BaseCharSet = function(str) {
	this.set = str;
	this.bits = (this.set.length - 1).toString(2).length;
	this.map = {};

	for (var i = 0; i < this.set.length; i++)
	{
		var char = this.set.charAt(i);
		this.map[char] = i;
	}
}

exports.EncodingCharSet = function(str) {

	var isSetAtPowerOf2 = false;

	this.set = str.substring(0, str.length);
	this.bits = (this.set.length - 1).toString(2).length;
	this.po2 = Math.pow(2, this.bits);

	if (this.set.length < this.po2)
	{
		// Use last symbol as escape char for encoding (like UTF-8)
		this.escapeChar = str.charAt(str.length - 1);
		// Recalculating set
		this.set = str.substring(0, str.length - 1);
		this.bits = (this.set.length - 1).toString(2).length;
		this.po2 = Math.pow(2, this.bits);
	}
	else
	{
		// No need for escapeChar - set length is power of 2
		this.escapeChar = '';
		isSetAtPowerOf2 = true;
	}

	this.map = {};

	for (var i = 0; i < this.set.length; i++)
	{
		var char = this.set.charAt(i);
		this.map[char] = i;
	}

	this.encode = function(value) {
		if (isNaN(value))
		{
			console.error('Value ' + value + ' is not a number');
			return '';
		}
		if (value > this.po2 - 1)
		{
			console.error('Value cannot be decoded with given bit length. Try less bits.');
			return '';
		}

		var result = '';
		// Need to escape a char
		if (value > this.set.length - 1)
		{
			result = this.escapeChar;
			value -= this.set.length;
		}

		result += this.set.charAt(value);

		return result;
	}

}

exports.getObjectIdTime = function(id) {
	var str = "";

	// make sure it's an ObjectId, not just a string
	id = new ObjectId(String(id));

	// creation date
	var date = id.getTimestamp();

	// time in milliseconds (with precision in seconds)
	var time = date.getTime();

	// hexadecimal counter converted to a decimal
	var counter = parseInt(id.toHexString().slice(-6), 16);

	// only use the last 3 digits of the counter to serve as our "milliseconds"
	counter = parseInt(counter.toString().slice(-3), 10);

	// add counter as our millisecond precision to our time
	time = time + counter;

	str += time;

	return str;
}

exports.padLeft = function(number, width, char) {
	char = char || '0';
	width -= number.toString().length;

	if (width > 0)
	{
		return new Array(width + (/\./.test(number) ? 2 : 1)).join(char) + number;
	}
	return number + ""; // always return a string
}
