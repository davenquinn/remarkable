const {Asset} = require('parcel-bundler')
const {getOptions} = require('loader-utils')
const mdx = require('@mdx-js/mdx')
const mdxPlugin = require('../helpers/mdx')

class MDXSlidesAsset extends Asset {
  constructor(name, pkg, options) {
    super(name, pkg, options)
    this.type = 'js'
  }

  async generate() {

    const options = {};
    options.remarkPlugins = options.mdPlugins || []
    options.remarkPlugins.push(mdxPlugin)

    const compiled = await mdx(this.contents, options)
    // This kinda abuses compilation
    const fullCode = `/* @jsx mdx */
import mdx from '@mdx-js/react/dist/create-element.js';
${compiled}
`

    console.log(fullCode);
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
