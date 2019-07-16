#export * from './components'
export * from './process-slides'

import "../remark/src/remark.js"

createSlideshow = (opts)->
  opts.navigation ?= {click: false, scroll: false}
  remark.create(opts)

export {createSlideshow}
