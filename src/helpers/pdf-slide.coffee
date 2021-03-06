import { Document, Page, pdfjs } from 'react-pdf/dist/entry.parcel'
import h from 'react-hyperscript'
import {render} from 'react-dom'
import {Component} from 'react'

PDFPage = ({file, page, rest...})->
  h Document, {file, rest...}, [
    h Page, {pageNumber: page, width: 908}
  ]


PDFSlide = (file, opts={})->
  {page} = opts
  node = document.createElement('div')

  renderer = (el, cb)->
    onLoadSuccess = ->
      console.log "Loaded #{file}"
    main = h PDFPage, {file, page, onLoadSuccess}
    render(main, node)
    el.style.padding = 0
    el.appendChild(node)
  {renderer}

PDFSlides = (file, opts={})->
  doc = pdfjs.getDocument(file)
  pdf = await doc.promise
  {numPages} = pdf._pdfInfo

  renderFunc = (pageNumber)->(el, cb)->
    onLoadSuccess = ->
      console.log "Loaded #{file}"
    main = h Page, {pdf, pageNumber, width: 908, renderAnnotationLayer: null}
    render(main, el)
    el.style.padding = 0

  {pages} = opts
  pages ?= [1..numPages]
  for page in pages
    renderer = renderFunc(page)
    {renderer}

export {PDFSlide, PDFSlides}
