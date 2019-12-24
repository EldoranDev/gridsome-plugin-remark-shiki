# gridsome-plugin-remark-shiki

[![Version](https://img.shields.io/npm/v/gridsome-plugin-remark-shiki.svg)](https://www.npmjs.com/package/gridsome-plugin-remark-shiki)

> Syntax highlighter for markdown code blocks using [shiki](https://shiki.matsu.io/)

## Install

```sh
yarn add gridsome-plugin-remark-shiki
npm install gridsome-plugin-remark-shiki
```

## Usage

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
