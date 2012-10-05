HTML Tidy
=========

Node Wrapper for HTML Tidy

What is HTML Tidy?
-----------------
HTML Tidy is an open source program for checking and generating clean XHTML/HTML.
It cleans up coding errors in HTML files and fixes bad formatting.
It can output files in the HTML, XHTML or XML file format.

Using HTML Tidy, developers can programatically clean up and fix poorly-written HTML pages.
Another use is to convert HTML to XHTML or XML.
These files can then be easily processed using the tools in the traditional XML chain,
such as XSL transforms.

Installation
------------
To use this library simply install it using [npm](http://npmjs.org/):

    npm install htmltidy

Example
-------

```javascript
var tidy = require('htmltidy').tidy;
tidy('<table><tr><td>badly formatted html</tr>', function(err, html) {
    console.log(html);
});
```

API
---
__tidy(text, [options], callback)__

Clean html like text according optional configuration [tidy options](http://w3c.github.com/tidy-html5/quickref.html).

```javascript
var opts = {
    doctype: 'html5',
    hideComments: false, //  multi word options can use a hyphen or "camel case"
    indent: true
}
```
__createWorker([options])__

Create transform stream which can receive html like data as writable stream and output cleaned html/xml as readable stream.

```javascript
var worker = tidy.createWorker(opts);
request.get('http://www.nodejs.org').pipe(worker).pipe(process.stdout);
```

Platform support
----------------
* Linux
* Windows
* OSX (experimental)

Changelog
---------
    0.0.2 - Oct 5, 2012
      - node Stream support, pipe and so on
      - more examples
      - example with worker pool for web front ends
      - experimental support for osx [#1](https://github.com/vavere/htmltidy/issues/1)
    0.0.1 - Sep 29, 2012
      - First NPM release

Credits
-------
* [HTML Tidy Library Project](http://tidy.sourceforge.net/)
* [HTML Tidy for HTML5](http://w3c.github.com/tidy-html5/)
* [Michael Leaney](http://stackoverflow.com/a/8220285/770155)



