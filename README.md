Short MongoDB ObjectId
===================
Generate short id's from MongoDB Object ID's for use in url's or other applications.

The module can be used in few modes.
You can configure a generation of very short ids based on mongoDB ObjectIds using only timestamp + counter and dropping  machine id and process id.
In this case a reverse operation is not possible.
There is also a way to generate absolute indentical ids that include machine id and process id. This is a reversible conversion.
I'm planning to include this feature in next release.

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

Use
---



Pass a MongoDB ObjectId (or a string that can be converted to one) and it will return a reasonably unique short id made of `[a-zA-Z0-9]`.

```javascript

```

License
-------
MIT (see [License](LICENSE))