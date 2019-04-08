const {Asset} = require('parcel-bundler')
const {getOptions} = require('loader-utils')
const {createSlides} = require('../helpers/mdx')

class MDXSlidesAsset extends Asset {
  constructor(name, pkg, options) {
    super(name, pkg, options)
    this.type = 'js'
  }

  async generate() {
    const fullCode = await createSlides(this.contents)

    return [
      {
        type: 'js',
        value: fullCode,
        sourceMap: undefined
      }
    ]
  }
}

module.exports = MDXSlidesAsset
