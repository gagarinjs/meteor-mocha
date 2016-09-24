Object.defineProperty(module.constructor.prototype, 'paths', {
  get: function () {
    if (!Object.hasOwnProperty(this, 'paths')) {
      return this.paths = [];
    }
  }
});
