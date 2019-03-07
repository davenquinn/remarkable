const path = require('path');
const Asset = require('parcel-bundler/src/Asset');

class MarkdownSlidesAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = 'json';
    this.hmrPageReload = true;
  }

  async generate() {
    const {parseSlides} = require('remark');
    const compiled = parseSlides(this.contents);
    console.log(compiled);
    return [
      {
        type: 'json',
        value: JSON.stringify(compiled)
      }
    ];
  }
}

module.exports = MarkdownSlidesAsset;
