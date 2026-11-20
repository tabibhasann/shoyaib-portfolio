import {articleBody, linkCard, pageHeader, seo, table} from './objects'
import {article, workSample} from './documents'
import {editingPage, homePage, siteSettings, staticPage, videoPage, writingPage} from './singletons'

export {SINGLETONS} from './singletons'

export const schemaTypes = [
  // objects
  seo,
  pageHeader,
  linkCard,
  table,
  articleBody,
  // one-of-a-kind pages
  siteSettings,
  homePage,
  editingPage,
  videoPage,
  staticPage,
  writingPage,
  // collections
  article,
  workSample,
]
