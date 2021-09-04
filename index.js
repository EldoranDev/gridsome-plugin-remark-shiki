const shiki = require('shiki')
const visit = require('unist-util-visit')
const rangeParser = require('parse-numeric-range')
const { renderToHtml } = require('./renderer')

const FALLBACK_LANGUAGE = 'text'
const LANG_TEXT = ['text', 'txt', 'plaintext']

const resolveLanguage = (lang, aliases) => (aliases && aliases[lang] ? aliases[lang] : lang)

const parseMeta = meta => {
  const opts = meta.slice(1, -1)
  const linesToHighlight = rangeParser(opts)

  return {
    linesToHighlight: linesToHighlight && linesToHighlight.length > 0 ? linesToHighlight : null
  }
}

const highlight = ({ value, lang, meta }, highlighter, options) => {
  const htmlRendererOptions = options.htmlRendererOptions || {}

  if (lang.includes('{') && lang.endsWith('}')) {
    const sep = lang.split(/(?={)/)
    lang = sep[0]
    meta = sep[1]
  }

  const language = resolveLanguage(lang, options.aliases)
  const index = shiki.BUNDLED_LANGUAGES.findIndex(
    x => x.id === language || (x.aliases && x.aliases.includes(language))
  )

  if (options.showLanguage) {
    htmlRendererOptions.langId = language
  }

  const lines =
    index >= 0 || LANG_TEXT.includes(language)
      ? highlighter.codeToThemedTokens(value, language)
      : highlighter.codeToThemedTokens(value, FALLBACK_LANGUAGE)

  let metaOptions
  if (meta) {
    metaOptions = parseMeta(meta)
  }

  if (lines.length > 1) {
    if (options.showLineNumbers) {
      const maxWidth = `${lines.length}`.length
      htmlRendererOptions.showLineNumbers = true
      htmlRendererOptions.lineNumberFormatter = lineNumber => `${lineNumber}`.padStart(maxWidth)
    }

    htmlRendererOptions.linesToHighlight =
      options.highlightLines && metaOptions && metaOptions.linesToHighlight
        ? metaOptions.linesToHighlight
        : null
  } else {
    htmlRendererOptions.showLineNumbers = false
  }

  return renderToHtml(lines, htmlRendererOptions)
}

const traverse = (tree, tokenType, highlighter, options) => {
  visit(tree, tokenType, node => {
    node.type = 'html'
    try {
      node.value = highlight(node, highlighter, options)
    } catch (e) {
      node.value = '<code>ERROR Rendering Code Block</code>'
    }
  })
}

module.exports = options => {
  const theme = options.theme ? options.theme : 'nord'
  options.aliases = options.aliases ? options.aliases : {}

  return async tree => {
    const highlighter = await shiki.getHighlighter({ theme })

    try {
      const { fg, bg } = highlighter.getTheme()
      options.htmlRendererOptions = { fg, bg }

      traverse(tree, 'code', highlighter, options)

      if (!options.skipInline) {
        traverse(tree, 'inlineCode', highlighter, options)
      }
    } catch (e) {
      console.error(`Failed to load Shiki theme ${theme}`)
    }
  }
}
