const path = require('path');
const Asset = require('parcel-bundler/src/Asset');

class PDFSlidesAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = 'js';
    this.hmrPageReload = true;
  }

  async generate() {
    const compiled = parseSlides(this.contents);
    console.log(compiled);
    return [
      {
        type: 'js',
        value: JSON.stringify(compiled)
      }
    ];
  }
}

module.exports = PDFSlidesAsset;

