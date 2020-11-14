const shiki = require('shiki')
const { BUNDLED_LANGUAGES } = require('shiki-languages')
const visit = require('unist-util-visit')

const CLASS_BLOCK = 'shiki'
const CLASS_INLINE = 'shiki-inline'

const FALLBACK_LANGUAGE = 'text'

const ERROR_MESSAGE = '<code>ERROR Rendering Code Block</code>'

const LANG_TEXT = ['text', 'txt', 'plaintext']

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

  if (index >= 0 || LANG_TEXT.includes(lang)) {
    return highlighter.codeToHtml(value, lang)
  } else {
    // fallback for unknown languages
    return highlighter.codeToHtml(value, FALLBACK_LANGUAGE)
  }
}
