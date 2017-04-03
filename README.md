# meteor-mocha

This repository contains a set of packages to help writing mocha tests in Meteor environment.

## Quick start

```
meteor add gagarin:mocha-driver
meteor add gagarin:mocha-reporter
meteor test --driver-package gagarin:mocha-driver
```

To add some tests, simply put them in `*.test(s).js` files somewhere in your project, e.g.
```javascript
describe('The simplest possible test suite', function () {
  it('should be ok', function () {
    // ...
  });
});
```
You can now see the tests results at http://localhost:3000. As you will see we are using in browser terminal
to show the results, which means that you can use whatever mocha reporter you like the most, e.g.

http://localhost:3000/?reporter=nyan

## Using with the cli tool

You you don't feel like watching the tests results in your browser, and instead you prefer to
have all of them printed in a terminal, you can use `gagarin-mocha-cli`.
```
npm install -g @gagarinjs/mocha-cli
```
Simply start meteor in test mode with `gagarin:mocha-driver` as you would normally do
and run `gagarin-mocha-cli` in another terminal to watch the results.
