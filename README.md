Short MongoDB ObjectId
===================
Generate short id's from MongoDB Object ID's for use in url's or other applications.

Id's are generated from the timestamp and counter of the MongoDB Id, with some slight variation. They should be reasonably unique.

This is, unfortunately, a one-way function. It will reliably produce the same short id for the same MongoDB Id, but the operation can't be reversed (it is missing information about the machine id, process id, and most of the counter).

Install
-------
Use NPM:

```bash
$ npm install shortobjectid
```

or Git:

```bash
$ git clone git@github.com:AHgPuK/shortobjectid.git
```

Use
---

Pass a MongoDB ObjectId (or a string that can be converted to one) and it will return a reasonably unique short id made of `[a-zA-Z0-9]`.

```javascript

```

License
-------
MIT (see [License](LICENSE))