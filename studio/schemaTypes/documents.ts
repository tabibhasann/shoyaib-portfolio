import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {PlayIcon} from '@sanity/icons/Play'
import {ImageIcon} from '@sanity/icons/Image'
import {defineField, defineType} from 'sanity'

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Web address',
      description:
        'The end of the page address, e.g. "what-is-mph" → shoyaibraby.com/writing/what-is-mph.html. Click "Generate". Avoid changing it after publishing, or old links will break.',
      type: 'slug',
      options: {source: 'title', maxLength: 60},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'shortTitle',
      title: 'Short title for the home page list',
      description: 'Optional. Leave empty to use the full title.',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      description: 'One word, e.g. Marketing, Mindset, Education.',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      options: {dateFormat: 'D MMMM YYYY'},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      description: 'The short paragraph under the title.',
      type: 'text',
      rows: 3,
    }),
    defineField({name: 'body', title: 'Article text', type: 'articleBody'}),
    defineField({name: 'seo', title: 'Search & sharing', type: 'seo'}),
  ],
  orderings: [{title: 'Newest first', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]}],
  preview: {
    select: {title: 'title', category: 'category', date: 'date'},
    prepare: ({title, category, date}) => ({title, subtitle: [category, date].filter(Boolean).join(' · ')}),
  },
})

export const workSample = defineType({
  name: 'workSample',
  title: 'Work sample',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'kind',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Video', value: 'video'},
          {title: 'Image / static design', value: 'image'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'video',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'video',
      title: 'Video file',
      description: 'MP4 works best. Please keep it under about 15 MB so the page loads fast on phones.',
      type: 'file',
      options: {accept: 'video/mp4,video/webm,video/quicktime'},
      hidden: ({document}) => document?.kind !== 'video',
      validation: (r) =>
        r.custom((v, ctx) => (ctx.document?.kind === 'video' && !v ? 'Upload a video file' : true)),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      hidden: ({document}) => document?.kind !== 'image',
      validation: (r) =>
        r.custom((v, ctx) => (ctx.document?.kind === 'image' && !v ? 'Upload an image' : true)),
    }),
    defineField({
      name: 'alt',
      title: 'Image description (for blind visitors and Google)',
      description: 'One short sentence describing what is in the picture or video.',
      type: 'string',
    }),
    defineField({
      name: 'tag',
      title: 'Tag on the gallery page',
      description: 'Small label, e.g. "Health Tips", "Healthcare Campaign".',
      type: 'string',
    }),
    defineField({
      name: 'homeTitle',
      title: 'Title on the home page',
      description: 'Optional. Leave empty to use the title above.',
      type: 'string',
    }),
  ],
  preview: {
    select: {title: 'title', kind: 'kind', tag: 'tag', media: 'image'},
    prepare: ({title, kind, tag, media}) => ({
      title,
      subtitle: [kind === 'video' ? 'Video' : 'Image', tag].filter(Boolean).join(' · '),
      media: media || PlayIcon,
    }),
  },
})
