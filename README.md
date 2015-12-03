Short MongoDB ObjectId
===================
Generate short id's from MongoDB Object ID's for use in url's or other applications.

The module can be used in few modes.
You can configure a generation of very short ids based on mongoDB ObjectIds using only timestamp + counter and dropping  machine id and process id.
In this case a reverse operation is not possible.
There is also a way to generate absolute indentical ids that include machine id and process id. This is a reversible conversion.

You can use and configure any set of characters for generation. The most problem of similar modules is a requirement of charset with length of power of 2.
This module is free from this limitation.
It is very useful for generation short urls based on charset of only digits and letters.


Install
-------
Use NPM:

```bash
$ npm install id-shorter
```

or Git:

```bash
$ git clone git@github.com:AHgPuK/id-shorter.git
```

Use as MongoDB ObjectId very short shorter (id made of `[a-zA-Z0-9]`)
---
```javascript
var ShortId = require('id-shorter');
var mongoDBShortId = ShortId();
var shortId = mongoDBShortId.encode('565ffd0edf3d990540b3134c');
```
Result: 48yD4jA45

Use as MongoDB ObjectId reversible shorter (id made of `[a-zA-Z0-9]`)
---
```javascript
var ShortId = require('id-shorter');
var mongoDBId = ShortId({
	isFullId: true
});
var shortId = mongoDBId.encode('565ffd0edf3d990540b3134c');
```
Result: cdNI0lgCZ0YJ3Z0Z2Bl

Use as decoder from reversible id (id made of `[a-zA-Z0-9]`)
---
```javascript
var ShortId = require('id-shorter');
var mongoDBId = ShortId({
	isFullId: true
});
var shortId = mongoDBId.decode('cdNI0lgCZ0YJ3Z0Z2Bl');
```
Result: 565ffd0edf3d990540b3134c

Use as BINARY to HEX converter (extreme usage :)
---
```javascript
var ShortId = require('id-shorter');
var Bin2Hex = ShortId({
	base: '01',
	encoding: '0123456789abcdef',
	isInverse: false,
	isFullId: true,
});
var result = Bin2Hex.encode('0000000100100011010001010110011110001001101010111100110111101111');
```
Result: 0123456789abcdef

License
-------
MIT (see [License](LICENSE))