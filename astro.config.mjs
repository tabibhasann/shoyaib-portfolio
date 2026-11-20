import {defineConfig} from 'astro/config'

// Static site: every page is built to plain HTML at build time from Sanity content.
export default defineConfig({
  site: 'https://shoyaibraby.com',
  output: 'static',
  // Keep the old addresses: writing/index.astro -> writing/index.html,
  // writing/[slug].html.astro -> writing/what-is-mph.html, etc.
  build: {format: 'preserve'},
  trailingSlash: 'ignore',
  devToolbar: {enabled: false},
})
