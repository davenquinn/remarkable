import React from 'react'
import styled from '@emotion/styled'
import h from 'react-hyperscript'
import Iframe from 'react-iframe'

ColoredBackground = (props) ->
  {color, rest...} = props
  color ?= '#aaa'
  h 'div', {style: {backgroundColor: color}, rest...}

TitleWrapper = styled.div"""
  font-size: 1.2em;
"""

TitleSlide = (props)->
  h TitleWrapper, props

LargeListW = styled.div"""
ul {
  font-size: 1.2em;
}
"""

LargeList = (props)->
  h LargeListW, props


WebviewFrame = styled.div"""
  width: 908px;
  min-height: 681px;
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
"""

InlineWebview = (props)->
  {src, outerWidth, innerWidth, scale, height, width, fill, rest...} = props
  height ?= 300
  width ?= 733.333
  style = {overflow: 'hidden', height, display: 'block'}
  h Iframe, {url: src, style, height, width, rest...}

class Webview extends React.Component
  render: ->
    {src, outerWidth, innerWidth, wide, width, rest...} = @props
    width ?= 908
    wide ?= false
    if wide
      width = 1210

    top = if fill? then 0 else null

    if document.activeElement.id == rest.id
      console.log "Active"

    outerWidth ?= width
    innerWidth ?= width
    style = {width: "#{outerWidth}px", top:0}
    ratio = outerWidth/innerWidth
    ratio = 1-ratio*2
    console.log ratio
    h WebviewFrame, {style}, [
      h 'div.scaler', {style: {transform: "scale(#{ratio})"}}, [
        h Iframe, {
          frameBorder: 0,
          url: src, width: innerWidth, height: 681/ratio, rest...}
      ]
    ]

Shout = styled.div"""
  font-size: 1.2em;
  background-color: #eee;
  font-style: italic;
  border-radius: 0.1em;
  padding: 0.5em 2em;
"""

Big = styled.div"""
font-size: 1.4em;
margin-bottom: 0.5em;
"""

Lh = styled(Big)"""
  font-size: 1.2em;
  margin: 1em 0 0.5em;
"""

class Layout extends React.Component
  render: ->
    h 'div.__layout-slide', @props

Img = (props)->
  h 'div', (
    h 'img', props
  )

__img = styled.img"""
  margin: 2em auto;
  display: block;
"""

FullImage = styled.img"""
  min-height: 681px;
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
  margin: 0 auto;
"""

CenteredImage = (props)->
  h __img, props

export {ColoredBackground, TitleSlide, Webview, LargeList,
        Shout, Layout, FullImage, InlineWebview, CenteredImage, Big, Lh, Img}
