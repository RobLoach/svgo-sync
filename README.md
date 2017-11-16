**english** | [русский](https://github.com/svg/svgo/blob/master/README.ru.md)
- - -

<img src="https://svg.github.io/svgo-logo.svg" width="200" height="200" alt="logo"/>

# why make this

svgo use a callback to get the parsed data.

but i just want it tobe synchronous.

# how

svgo use sax-js to parse svg,because sax-js is asynchronous,then svgo have to be asynchronous too.

so i just change the sax-js to htmlparser2 which support parse svg synchronous.

# use

install:

```
npm install svgo-sync
```

just add one more api:


```
SVGO = require('svgo-sync');
svgo = new SVGO(/*{ custom config object }*/);

// sync version for optimize
var result = svgo.optimizeSync(str);

console.log(result);
```
