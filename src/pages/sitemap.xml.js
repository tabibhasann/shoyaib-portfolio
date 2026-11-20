// Builds sitemap.xml automatically, so new articles are always listed for Google.
import {client} from '../lib/sanity.js'

const SITE = 'https://shoyaibraby.com'

export async function GET() {
  const articles = await client.fetch(
    `*[_type == "article" && defined(slug.current)] | order(date desc){"slug": slug.current, date, _updatedAt}`,
  )
  const pages = [
    {loc: '/', priority: '1.0'},
    {loc: '/editing/', priority: '0.8'},
    {loc: '/editing/video-editing.html', priority: '0.7'},
    {loc: '/editing/static-design.html', priority: '0.7'},
    {loc: '/writing/', priority: '0.8'},
    ...articles.map((a) => ({loc: `/writing/${a.slug}.html`, priority: '0.6', lastmod: (a._updatedAt || a.date || '').slice(0, 10)})),
  ]
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${SITE}${p.loc}</loc>${p.lastmod ? `\n    <lastmod>${p.lastmod}</lastmod>` : ''}
    <changefreq>monthly</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`
  return new Response(body, {headers: {'Content-Type': 'application/xml'}})
}
