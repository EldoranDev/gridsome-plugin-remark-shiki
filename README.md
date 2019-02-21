# gridsome-plugin-remark-shiki

<a href="https://www.npmjs.com/package/gridsome-plugin-remark-shiki">
    <img src="https://img.shields.io/npm/v/gridsome-plugin-remark-shiki.svg" alt="Version">
</a>

> Syntax highlighter for markdown code blocks using [shiki](https://shiki.matsu.io/)

## Install
- `yarn add gridsome-plugin-remark-shiki`
- `npm install gridsome-plugin-remark-shiki`

## Usage

Add syntax highlighter to a single markdown source using the given options:

```js
{
  // Can be any of
  // https://github.com/octref/shiki/tree/master/packages/themes
  // and will default to 'nord'
  theme: 'nord'
}
```

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
            [ 'gridsome-plugin-remark-shiki', { theme: 'nord' } ]
          ]
        }
      }
    }
  ]
}
```

Add syntax highlighter to all markdown sources:

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
        [ 'gridsome-plugin-remark-shiki', { theme: 'nord' } ]
      ]
    }
  }
}
```
