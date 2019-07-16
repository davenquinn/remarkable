import h from 'react-hyperscript'
import {MDXProvider} from '@mdx-js/react'
import {renderToString} from 'react-dom/server'

processMDXSlides = ->
  mdxSlides = []
  for slide,i in slides
    {component, properties, continued, notes, folio, rest...} = slide
    properties ?= {}
    if folio? and folio
      properties.folio = folio

    {backgroundColor} = rest

    if notes?
      notes2 = h MDXProvider, {components: {}}, [
        h notes
      ]
      notes2 = renderToString notes2


    if component?
      c = h MDXProvider, {components: {}}, [
        h component
      ]
      html = renderToString c

      onShow = (el)->
        try
          backgroundColor ?= e.children[0].style.backgroundColor
          e.style.backgroundColor = backgroundColor
        catch
          null

    mdxSlides.push {onShow, html, notes: notes2, properties, folio}

  return mdxSlides

export {processMDXSlides}
