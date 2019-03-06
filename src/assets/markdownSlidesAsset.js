const path = require('path');
const Asset = require('parcel-bundler/src/Asset');
const localRequire = require('parcel-bundler/src/utils/localRequire');

class MarkdownSlidesAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = 'json';
    this.hmrPageReload = true;
  }

  async generate() {
    const parse = require('remark/src/parse');

    const compiled = parse(this.contents);
    return JSON.stringify(compiled);
  }
}

module.exports = MarkdownSlidesAsset;
