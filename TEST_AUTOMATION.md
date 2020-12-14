# Test Automation

Tests can be executed by running:

```
npm test
```

This runs JavaScript file `test-menu.js` from the root folder. The names of the available tests as shown in the menu are defined in the file `test-menu.json`.

At present only a single Jest test has been implemented: `ex1-bookList`. 

- It runs a validation check against the generated HTML.
- It check for the presence of the expected HTML elements and content.

ESLint checking to be added.