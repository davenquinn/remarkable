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

Webview = (props)->
  {src, outerWidth, innerWidth, rest...} = props
  top = null
  if fill?
    top = 0
  outerWidth ?= 908
  innerWidth ?= 1200
  style = {width: "#{outerWidth}px", top}
  ratio = outerWidth/innerWidth
  h WebviewFrame, {style}, [
    h 'div.scaler', {style: {transform: "scale(#{ratio})", marginLeft: "-126px"}}, [
      h Iframe, {url: src, width: "#{innerWidth}px", height: 681/ratio, rest...}
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

CenteredImage = (props)->
  h __img, props

export {ColoredBackground, TitleSlide, Webview,
        Shout, Layout, InlineWebview, CenteredImage, Big, Lh, Img}
