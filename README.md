![logo](https://s3.amazonaws.com/gagarinjs/assets/gagarinLogo.svg)

# meteor-mocha

This repository contains a set of packages to help writing mocha tests in Meteor environment.

## Quick start

```
meteor npm install --save-dev mocha
meteor add gagarin:mocha-driver
meteor add gagarin:mocha-reporter
meteor test --driver-package gagarin:mocha-driver
```
Please note that you need to add `mocha` manually. This is a good, because you can use whatever
version of `mocha` you want.


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

![preview](https://s3.amazonaws.com/gagarinjs/assets/gagarinMochaPreview.gif)

## Using with the cli tool

You you don't feel like watching the tests results in your browser, and instead you prefer to
have all of them printed in a terminal, you can use `gagarin-mocha-cli`.
```
npm install -g @gagarinjs/mocha-cli
```
Then run
```
gagarin-mocha-cli
```
in your project root. By default `gagarin-mocha-cli` will spawn `meteor` process in the background and will connect to it to grab tests results. See `gagarin-mocha-cli --help`,
for all available options. For continous integration you will probably want to use
```
gagarin-mocha-cli --once --reports-only --reporter <reporter>
```
