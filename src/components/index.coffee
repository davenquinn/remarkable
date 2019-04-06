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
  font-size: 1.4em;
  font-weight: 600;
  background-color: #444;
  color: #fff;
  font-style: italic;
  border-radius: 0.2em;
  text-align: center;
  padding: 0.5em 2em;
"""

class Layout extends React.Component
  render: ->
    h 'div.__layout-slide', @props

export {ColoredBackground, TitleSlide, Webview, Shout, Layout}
