# Notifire

A simple notification library for code quality. 

## The cheesey sales pitch

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

Ever been told 'we will look into fixing it later' and then never got round to it?

Then you need Notifire!

## Functionality

Notifire provides a simple interface that processes comments and fires notifications once the conditions are met (see what I did there?). Notifier can then be run during a build and will fail if there are any resolveable issues within your code. A Notifier notification is configured using comments:

```js

// noti-fire NOTIFIER_NAME [PARAMS]

```

Noti-fire then scans all code files for these notification, checks to see weather any of the conditions have been met and fails if this is the case. There are currently 3 build in notifires:

### Date

Review this code once a specific date has passed:

```js

// Needs reviewing
// noti-fire DATE 11/11/3011
const hackyFunction = function() {
    // Some terrible code here
} 

```

Once the date has passed notifire will then start failing, letting you know that this code needs to be addressed.

### Github

Review this code when a specific Github issue is resolved:

```js

// Once [FEATURE] lands we won't need this anymore
// noti-fire GITHUB ISSUE [ORG] [REPO] [NUMBER]
const hackyFunction = function() {
    // Some terrible code here
} 

```

Once this issue is closed notifire will then start failing, letting you know that this code needs to be addressed.


### Jira

Review this code when a specific Jira issue is at a given state:

```js

// Once the middleware team implement [FEATURE] we won't need this
// noti-fire JIRA [NUMBER] [STATUS]
const hackyFunction = function() {
    // Some terrible code here
} 

```

Once the Jira story is at the status specified noti-fire will start failing, letting you know that this code needs to be addressed.

