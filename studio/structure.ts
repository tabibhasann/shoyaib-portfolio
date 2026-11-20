import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {ImageIcon} from '@sanity/icons/Image'
import type {StructureResolver} from 'sanity/structure'

/** Each singleton page opens directly (no list), with a fixed document id. */
const page = (S: Parameters<StructureResolver>[0], type: string, title: string) =>
  S.listItem()
    .title(title)
    .id(type)
    .schemaType(type)
    .child(S.document().schemaType(type).documentId(type).title(title))

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Website')
    .items([
      page(S, 'homePage', 'Home page'),
      page(S, 'writingPage', 'Writing page'),
      page(S, 'editingPage', 'Editing page'),
      page(S, 'videoPage', 'Video editing page'),
      page(S, 'staticPage', 'Static design page'),
      S.divider(),
      S.documentTypeListItem('article').title('Articles').icon(DocumentTextIcon),
      S.documentTypeListItem('workSample').title('Work samples (videos & images)').icon(ImageIcon),
      S.divider(),
      page(S, 'siteSettings', 'Site settings (email, Upwork, share image)'),
    ])
