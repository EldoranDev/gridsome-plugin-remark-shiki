const htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}

const escapeHtml = html => html.replace(/[&<>"']/g, chr => htmlEscapes[chr])

const renderToHtml = (lines, options) => {
  const fg = options.fg
  const bg = options.bg || '#fff'

  let html = ''

  if (options.langId) {
    html += `<div class="code-metadata">`
    html += `<span class="language-id">${options.langId}</span>`
    html += `</div>`
  }

  html += `<pre class="shiki" tabindex="0" style="background-color: ${bg}">`
  html += `<code>`

  lines.forEach((line, index) => {
    const lineNumber = index + 1

    if (options.linesToHighlight && options.linesToHighlight.includes(lineNumber)) {
      html += `<span class="line line-highlighted">`
    } else {
      html += `<span class="line">`
    }

    if (options.showLineNumbers) {
      html += `<span class="line-number" aria-hidden="true">${options.lineNumberFormatter(lineNumber)}</span>`
    }

    line.forEach(token => {
      const cssDeclarations = [`color: ${token.color || fg}`]
      html += `<span style="${cssDeclarations.join('; ')}">${escapeHtml(token.content)}</span>`
    })
    html += `</span>\n`
  })
  html = html.replace(/\n*$/, '') // Get rid of final new lines
  html += `</code></pre>`

  return html
}

module.exports = { renderToHtml }
