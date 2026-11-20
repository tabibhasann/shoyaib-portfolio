import {toHTML, escapeHTML} from '@portabletext/to-html'

/**
 * Turn editor text into safe HTML:
 *  - *word* becomes <span class="{cls}">word</span> (accent / italic / highlight style)
 *  - a line break becomes <br>
 */
export function accent(text, cls = 'italic') {
  if (!text) return ''
  return escapeHTML(text)
    .replace(/\*([^*]+)\*/g, `<span class="${cls}">$1</span>`)
    .replace(/\r?\n/g, '<br>')
}

export const esc = (s) => escapeHTML(s ?? '')

/** "2026-05-24" -> "May 24, 2026" (same format as the original pages). */
export const longDate = (iso) =>
  iso
    ? new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      })
    : ''

/** Article body (Sanity Portable Text) -> HTML using the site's existing classes. */
export function articleHTML(blocks) {
  return toHTML(blocks || [], {
    components: {
      block: {
        normal: ({children}) => `<p>${children}</p>`,
        h3: ({children}) => `<h3>${children}</h3>`,
      },
      list: {
        bullet: ({children}) => `<ul class="article-list">${children}</ul>`,
        number: ({children}) => `<ol class="article-list">${children}</ol>`,
      },
      marks: {
        link: ({children, value}) => {
          const href = value?.href || '#'
          const external = /^https?:/.test(href)
          return `<a href="${escapeHTML(href)}"${external ? ' target="_blank" rel="noopener"' : ''}>${children}</a>`
        },
      },
      types: {
        table: ({value}) => {
          const rows = value?.rows || []
          if (!rows.length) return ''
          const [head, ...body] = rows
          const cells = (r, tag) => (r.cells || []).map((c) => `<${tag}>${escapeHTML(c)}</${tag}>`).join('')
          return `<table class="article-table"><thead><tr>${cells(head, 'th')}</tr></thead><tbody>${body
            .map((r) => `<tr>${cells(r, 'td')}</tr>`)
            .join('')}</tbody></table>`
        },
      },
    },
  })
}
