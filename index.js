const shiki = require('shiki')
const { BUNDLED_LANGUAGES } = require('shiki-languages')
const visit = require('unist-util-visit')

const CLASS_BLOCK = 'shiki'
const CLASS_INLINE = 'shiki-inline'

const ERROR_MESSAGE = '<code>ERROR Rendering Code Block</code>'

module.exports = (options) => {
  let theme = options.theme ? options.theme : 'nord'

  try {
    shiki.getTheme(theme)
  } catch (e) {
    console.error(`Shiki theme ${theme} could not get loaded.`)
    theme = 'nord'
  }

  return async tree => {
    const highlighter = await shiki.getHighlighter({
      theme
    })

    visit(tree, 'code', node => {
      node.type = 'html'
      try {
        node.value = highlight(node, CLASS_BLOCK, highlighter)
      } catch (e) {
        node.value = ERROR_MESSAGE
      }
    })

    if (!options.skipInline) {
      visit(tree, 'inlineCode', node => {
        node.type = 'html'
        try {
          node.value = highlight(node, CLASS_INLINE, highlighter)
        } catch (e) {
          node.value = ERROR_MESSAGE
        }
      })
    }
  }
}

function highlight ({ value, lang }, cls, highlighter) {
  const index = BUNDLED_LANGUAGES.findIndex((x) => {
    return x.id === lang || (x.aliases && x.aliases.includes(lang))
  })
  const theme = shiki.getTheme('nord')

  if (index >= 0) {
    return highlighter.codeToHtml(value, lang)
  }

  // Fallback for unknown languages.
  return `<code class="${cls}" style="background: ${theme.bg}; color: ${theme.colors['terminal.foreground']}">${escape(value)}</code>`
}

function escape (value) {
  return value.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
