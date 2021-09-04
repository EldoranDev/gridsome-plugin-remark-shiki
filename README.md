# gridsome-plugin-remark-shiki

[![Version](https://img.shields.io/npm/v/gridsome-plugin-remark-shiki.svg)](https://www.npmjs.com/package/gridsome-plugin-remark-shiki)

> Syntax highlighter for markdown code blocks using [shiki](https://shiki.matsu.io/)

## Install

```sh
yarn add gridsome-plugin-remark-shiki
npm install gridsome-plugin-remark-shiki
```

## Usage

### With a single markdown source

Add syntax highlighter to a single markdown source using the given options:

```js
module.exports = {
  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'blog/**/*.md',
        route: '/blog/:year/:month/:day/:slug',
        remark: {
          plugins: [
            [ 'gridsome-plugin-remark-shiki', { theme: 'nord', skipInline: false } ]
          ]
        }
      }
    }
  ]
}
```

### With all markdown sources

Add syntax highlighter to all markdown sources, but skip inline code:

```js
module.exports = {
  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {}
    }
  ],

  transformers: {
    remark: {
      plugins: [
        [ 'gridsome-plugin-remark-shiki', { theme: 'nord', skipInline: true } ]
      ]
    }
  }
}
```

### Using custom themes

Use custom themes with the syntax highlighter:

```js
const shiki = require('shiki')

const customTheme = shiki.loadTheme('./static/custom-theme.json')

module.exports = {
  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'blog/**/*.md',
        typeName: 'Post',
        remark: {
          plugins: [
            [ 'gridsome-plugin-remark-shiki', { theme: customTheme, skipInline: true } ]
          ]
        }
      }
    }
  ]
}
```

### With [@gridsome/vue-remark](https://gridsome.org/plugins/@gridsome/vue-remark)

```js
module.exports = {
  plugins: [
    {
      use: '@gridsome/vue-remark',
      options: {
        typeName: 'BlogPost',
        baseDir: './blog/posts',
        template: './src/templates/BlogPost.vue',
        plugins: [
          [
            'gridsome-plugin-remark-shiki',
            { theme: 'nord', skipInline: true },
          ],
        ],
      },
    },
  ],
};
```

## Features

The following options are available for this plugin:

```js
{
  // declare a theme for syntax highlighting
  theme: 'nord',
  // skip the inline code elements (default: false)
  skipInline: true,
  // display language of the highlighted code (default: false)
  showLanguage: true,
  // display line numbers (default: false)
  showLineNumbers: true,
  // enable line highlighting (default: false)
  highlightLines: true,
  // set aliases
  aliases: {
    dockerfile: 'docker',
    yml: 'yaml'
  }
}
```

### Display language

When `showLanguage` is `true`, the plugin will add a block displaying the language as follows:

```html
<div class="code-metadata"><span class="language-id">js</span></div>
<pre class="shiki" tabindex="0"><code><!-- highlighted code --></code></pre>
```

You can write CSS to customize how you want to display `code-metadata`, e.g.,

```css
.code-metadata {
  user-select: none; /* disable copying metadata while copying the code from the code block */
  margin-bottom: 1ch;
}

.code-metadata .language-id {
  padding: 0.25em 0.5em;
  background-color: blue;
  color: white;
  border-radius: 0.25em;
}
```

> Note that the language will be shown only when it is [specified in the codeblock metadata](https://docs.github.com/en/github/writing-on-github/working-with-advanced-formatting/creating-and-highlighting-code-blocks#syntax-highlighting).

### Display line numbers

When `showLineNumbers` is `true`, the plugin will display the line numbers alongside each line.

```html
<pre class="shiki" tabindex="0">
  <code>
    <span class="line">
      <span class="line-number" aria-hidden="true">1</span>
      <span>console.log('Hello, world');</span>
    </span>
    <span class="line">
      <span class="line-number" aria-hidden="true">2</span>
      <span>console.log('This codeblock is displayed with line numbers!');</span>
    </span>
  </code>
</pre>
```

You can write custom CSS to control how the line numbers would look, e.g.,

```css
.shiki .line .line-number {
  display: inline-block;
  user-select: none; /* disable copying line numbers while copying the code from the code block */
  padding-inline-end: 2ch;
  text-align: right;
  opacity: 0.6;
}
```

> Note that line numbers will not be displayed for codeblocks of single line.

### Highlight lines

When `highlightLines` is `true`, you can specify the lines to highlight in code block's metadata. This could be a series or range of line numbers, e.g.,

<pre>
```js {2}
console.log('Hello, world!')
console.log('Behold the highlighted line!')
```

```js {1,3-4}
console.log('Hello, world! This is highlighted line!')
console.log('Your code is not your life.')
console.log('Behold another highlighted line!')
console.log('And yet another highlighted line!')
```
</pre>

### Aliases

If Shiki does not support highlighting your language or the language identifier that you used is different from what Shiki uses, you can alias them as follows to force syntax highlighting.

```js
aliases: {
  dockerfile: 'docker',
  yml: 'yaml'
}
```

### Dark Mode support

Shiki provides multiple ways to support Dark Mode. Refer to the documentation here: <https://github.com/shikijs/shiki/blob/main/docs/themes.md#dark-mode-support>
