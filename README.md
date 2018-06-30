# Notifire

A simple notification library for code quality. 

Are you tired of this:

```js
var library = require('library');

library.configure({
    property: true, // Have to pass this property for "function" to work see https://github.com/org/repo/issues/123
})

var result = library.function();
```

Does this ever happen to you:

```js
var library = require('library');

// Won't need to use this once this lands https://github.com/org/repo/issues/321
library.function();
```