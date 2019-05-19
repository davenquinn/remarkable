const visit = require('unist-util-visit')
const is_ = require('unist-util-is')
const mdxAstToMdxHast = require('@mdx-js/mdx/mdx-ast-to-mdx-hast')
const matter = require('gray-matter')
const stringifyObject = require('stringify-object')
const mdx = require('@mdx-js/mdx')

// custom implementation
// this can be removed in favor of https://github.com/mdx-js/mdx/issues/454
const toTemplateLiteral = text =>
  '{`' + text.replace(/\\/g, '\\\\').replace(/`/g, '\\`') + '`}'

// I hate javascript
/*
isContinuedDelimiter = (node) ->
  return false unless is_('paragraph', node)
  return false unless node.children?
  return false unless (node.children.length? and node.children.length == 1)
  el = node.children[0]
  return el.type == 'text' and el.value == '--'
*/
const isContinuedDelimiter = node => {
  if (!is_('paragraph', node)) { return false; }
  if (node.children == null) { return false; }
  if ((node.children.length == null) || (node.children.length !== 1)) { return false; }
  const el = node.children[0];
  return (el.type === 'text') && (el.value === '--');
};

const isNotesDelimiter = node => {
  if (!is_('paragraph', node)) { return false; }
  if (node.children == null) { return false; }
  if ((node.children.length == null) || (node.children.length !== 1)) { return false; }
  const el = node.children[0];
  return (el.type === 'text') && (el.value === '???');
};

const isExportLayout = node => {
  if (node.type != 'export') { return false; }
  return /^export\s+(const|let)\s+layout\s*=\s*true\s*;?$/.test(node.value)
}

let layoutSlide = [];

const toJSX = (node, parent, notes, opts = {}, properties = {}) => {
  const { preserveNewlines = false } = opts
  let children = ''

  if (notes != null) {
    notes.type = 'notes'
    notes = toJSX(notes, {})
  }

  if (node.type === 'root') {
    const jsxNodes = layoutSlide.slice(0)
    let layout = ''
    let extraParams = []

    if (notes != null) {
      extraParams.push(notes)
    }

    for (const child of node.children) {
      // imports/exports should already be handled for the root mdx component
      if (child.type === 'import') continue
      if (child.type === 'export') {
        if (!child.default) {
          name = child.value
            .replace(/^export\s+const\s+/, '')
            .replace(/\s*=/,':')
            .replace(/;\s*$/, '')
          extraParams.push(name)
          continue
        }
        layout = child.value
          .replace(/^export\s+default\s+/, '')
          .replace(/;\s*$/, '')
        continue
      }
      jsxNodes.push(child)
    }

    return [
      '{ component: (props => {',
      `  const __MDXDECK_LAYOUT__ = ${layout ? layout : '"div"'}`,
      '  return <__MDXDECK_LAYOUT__',
      '    name="wrapper"',
      '    components={props.components}>',
      '    ' + jsxNodes.map(child => toJSX(child, node)).join('\n    '),
      '  </__MDXDECK_LAYOUT__>',
      '  }),',
      `  properties: ${JSON.stringify(properties)},`,
      `  ${extraParams.join(',\n  ')}`,
      '}',
    ]
      .filter(Boolean)
      .join('\n')
  }

  if (node.type === 'notes') {
    return [
      'notes: (props => {',
      '  return <div',
      '    name="wrapper"',
      '    components={props.components}>',
      '    ' + node.children.map(child => toJSX(child, node)).join('\n    '),
      '  </div>',
      '  })',
    ]
      .filter(Boolean)
      .join('\n')
  }

  if (node.children) {
    children = node.children
      .map(child => {
        return toJSX(child, node, null, {
          preserveNewlines: preserveNewlines || node.tagName === 'pre',
        })
      })
      .join('')
  }

  if (node.type === 'element') {
    let props = ''
    if (Object.keys(node.properties).length > 0) {
      props = JSON.stringify(node.properties)
    }
    return [
      `<${node.tagName}`,
      parent.tagName && ` parentName="${parent.tagName}"`,
      props && ` {...${props}}`,
      '>',
      children,
      `</${node.tagName}>`,
    ]
      .filter(Boolean)
      .join('')
  }

  if (node.type === 'text') {
    const shouldPreserveNewlines = preserveNewlines || parent.tagName === 'p'
    if (node.value === '\n' && !shouldPreserveNewlines) {
      return node.value
    }
    return toTemplateLiteral(node.value)
  }

  if (node.type === 'comment') {
    return `{/*${node.value}*/}`
  }

  return node.value
}

const delimiter = 'thematicBreak'

const mdxPlugin = (opts = {}) => {
  return (tree, file) => {
    const { children } = tree
    const splits = []
    const slides = []

    visit(tree, node => {
      // Thematic break is ---
      if (is_(delimiter, node)) {
        const i = children.indexOf(node)
        splits.push(i)
      }

      if (isContinuedDelimiter(node)) {
        const i = children.indexOf(node)
        splits.push(i)
      }
    })

    let previousSplit = 0

    for (let i = 0; i < splits.length; i++) {
      const split = splits[i]

      slides.push(children.slice(previousSplit, split))
      previousSplit = split
    }

    slides.push(children.slice(previousSplit))

    let currentSlide = []
    let currentLayoutSlide = []
    let jsx = []

    for (slide of slides) {

      let notes  = null;
      const noteIndex = slide.findIndex(isNotesDelimiter)
      if (noteIndex != -1) {
        notes = slide.splice(noteIndex);
        notes = mdxAstToMdxHast()({
          type: 'root',
          children: notes.slice(1)
        })
      }

      let exportLayout = false
      for ([i,node] of slide.entries()) {
        if (isExportLayout(node)) {
          currentLayoutSlide = slide.slice(1)
          exportLayout = true
        }
      }
      if (exportLayout) { continue }

      const startNode = slide[0]
      if (startNode && isContinuedDelimiter(startNode)) {
        currentSlide = currentSlide.concat(slide.slice(1))
      } else {
        currentSlide = currentLayoutSlide.concat(slide.slice(1));
      }

      const children = currentSlide.slice(0)

      const hast = mdxAstToMdxHast()({
        type: 'root',
        children: children,
      })
      const code = toJSX(hast, {}, notes, { skipExport: true }, {})
      jsx.push(code)
    }

    tree.children.push({
      type: 'export',
      default: false,
      value: `export const slides = [${jsx.join(',\n')}]`,
    })
  }
}

const removeExportsPlugin = (opts = {}) => {
  return (tree, file) => {
    const { children } = tree
    const splits = []
    const slides = []

    tree.children = tree.children.filter( d => {
      return !isExportLayout(d)
    })
  }
}

const createSlides = async (content, options={})=> {
  options.remarkPlugins = options.mdPlugins || []
  options.remarkPlugins.push(mdxPlugin)
  options.remarkPlugins.push(removeExportsPlugin)

  const compiled = await mdx(content, options)
  // This kinda abuses compilation
  const fullCode = `/* @jsx mdx */
import React from 'react';
import { mdx } from '@mdx-js/react'
${compiled}
`
  return fullCode
}

module.exports = {mdxPlugin, createSlides};
