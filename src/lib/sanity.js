import {createClient} from '@sanity/client'
import {createImageUrlBuilder} from '@sanity/image-url'

// The dataset is public (read-only for visitors), so no token is needed to read published content.
export const client = createClient({
  projectId: 'x7xjqilb',
  dataset: 'production',
  apiVersion: '2025-01-01',
  useCdn: false,
  perspective: 'published',
})

const builder = createImageUrlBuilder(client)

/** Image URL from Sanity's image CDN, resized and converted to a modern format automatically. */
export const imageUrl = (source, width = 1600) =>
  source ? builder.image(source).width(width).fit('max').auto('format').url() : ''

const settingsQuery = `*[_id == "siteSettings"][0]{..., "shareImageUrl": shareImage.asset->url}`

let settingsPromise
export const getSettings = () => (settingsPromise ??= client.fetch(settingsQuery))

/** Fields every work sample needs to render. */
export const SAMPLE = `{_id, title, homeTitle, kind, tag, alt, image, "videoUrl": video.asset->url}`

/** Fields every article list needs. */
export const ARTICLE_ROW = `{_id, title, shortTitle, category, date, "slug": slug.current}`

/** Ordered list first, then anything not in it (newest first), so nothing is ever forgotten. */
export function withRemainder(ordered, all) {
  const list = (ordered || []).filter(Boolean)
  const seen = new Set(list.map((d) => d._id))
  return [...list, ...all.filter((d) => !seen.has(d._id))]
}
