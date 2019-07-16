#export * from './components'
export * from './process-slides'

import "../remark/build/remark.min.js"

createSlideshow = (opts)->
  opts.navigation ?= {click: false, scroll: false}
  remark.create(opts)

export {createSlideshow}
