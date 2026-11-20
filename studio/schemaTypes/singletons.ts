import {CogIcon} from '@sanity/icons/Cog'
import {HomeIcon} from '@sanity/icons/Home'
import {DocumentsIcon} from '@sanity/icons/Documents'
import {PlayIcon} from '@sanity/icons/Play'
import {ImagesIcon} from '@sanity/icons/Images'
import {EditIcon} from '@sanity/icons/Edit'
import {defineArrayMember, defineField, defineType} from 'sanity'

const ACCENT_HELP = 'Wrap words in *stars* to show them in the accent style. Press Enter for a new line.'

const section = (group: string, name: string, title: string, fields: ReturnType<typeof defineField>[]) =>
  defineField({name, title, group, type: 'object', options: {collapsible: true, collapsed: true}, fields})

const eyebrow = defineField({name: 'eyebrow', title: 'Small label (e.g. "01 — About")', type: 'string'})
const heading = defineField({name: 'heading', title: 'Heading', description: ACCENT_HELP, type: 'text', rows: 2})

const sampleList = (description: string) =>
  defineField({
    name: 'samples',
    title: 'Samples, in order',
    description,
    type: 'array',
    of: [defineArrayMember({type: 'reference', to: [{type: 'workSample'}]})],
  })

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({name: 'name', title: 'Name shown on the site', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'tagline', title: 'Footer line', description: 'e.g. "Shoyaib — Editor & Writer"', type: 'string'}),
    defineField({name: 'email', title: 'Contact email', type: 'string', validation: (r) => r.required().email()}),
    defineField({name: 'upworkUrl', title: 'Upwork profile link', type: 'url'}),
    defineField({name: 'location', title: 'City, country', type: 'string'}),
    defineField({
      name: 'shareImage',
      title: 'Link-preview image',
      description: 'Shown when the site is shared on WhatsApp, LinkedIn, Facebook… Best size 1200 × 630.',
      type: 'image',
    }),
    defineField({
      name: 'personDescription',
      title: 'One-line description of you (for Google)',
      type: 'string',
    }),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})

export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'top', title: 'Top', default: true},
    {name: 'middle', title: 'About · Services · Process'},
    {name: 'bottom', title: 'Work · Writing · Contact'},
    {name: 'seo', title: 'Search & sharing'},
  ],
  fields: [
    defineField({name: 'seo', title: 'Search & sharing', type: 'seo', group: 'seo'}),
    defineField({
      name: 'hero',
      title: 'Hero (first screen)',
      type: 'object',
      group: 'top',
      fields: [
        defineField({name: 'backgroundWord', title: 'Big faded background word', type: 'string'}),
        defineField({name: 'eyebrow', title: 'Small label above the headline', type: 'string'}),
        defineField({name: 'headline', title: 'Headline', description: ACCENT_HELP, type: 'text', rows: 2}),
        defineField({name: 'intro', title: 'Intro paragraph', type: 'text', rows: 3}),
        defineField({
          name: 'facts',
          title: 'Small facts under the intro',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'fact',
              fields: [
                defineField({name: 'label', title: 'Label', type: 'string'}),
                defineField({name: 'value', title: 'Value', type: 'string'}),
              ],
              preview: {select: {title: 'value', subtitle: 'label'}},
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'marquee',
      title: 'Scrolling skills strip',
      type: 'array',
      group: 'top',
      of: [{type: 'string'}],
    }),
    section('middle', 'about', 'About', [
      eyebrow,
      defineField({
        name: 'mainText',
        title: 'Main text',
        description: 'Wrap words in *stars* to underline-highlight them.',
        type: 'text',
        rows: 4,
      }),
      defineField({name: 'secondaryText', title: 'Second paragraph', type: 'text', rows: 4}),
      defineField({
        name: 'stats',
        title: 'Numbers (count up when scrolled to)',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'object',
            name: 'stat',
            fields: [
              defineField({name: 'prefix', title: 'Before the number (e.g. $)', type: 'string'}),
              defineField({name: 'value', title: 'Number', type: 'number', validation: (r) => r.required()}),
              defineField({name: 'decimals', title: 'Decimal places', type: 'number', initialValue: 0}),
              defineField({name: 'suffix', title: 'After the number, same size (e.g. K+, h)', type: 'string'}),
              defineField({name: 'unit', title: 'Small orange word after it (e.g. IELTS)', type: 'string'}),
              defineField({name: 'label', title: 'Label', type: 'string'}),
            ],
            preview: {
              select: {p: 'prefix', v: 'value', s: 'suffix', u: 'unit', label: 'label'},
              prepare: ({p, v, s, u, label}) => ({title: `${p || ''}${v ?? ''}${s || ''} ${u || ''}`, subtitle: label}),
            },
          }),
        ],
      }),
    ]),
    section('middle', 'services', 'Services', [
      eyebrow,
      heading,
      defineField({name: 'intro', title: 'Short text beside the heading', type: 'text', rows: 2}),
      defineField({name: 'editingCard', title: 'Editing card', type: 'linkCard'}),
      defineField({name: 'writingCard', title: 'Writing card', type: 'linkCard'}),
    ]),
    section('middle', 'process', 'How I work', [
      eyebrow,
      heading,
      defineField({
        name: 'steps',
        title: 'Steps',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'object',
            name: 'step',
            fields: [
              defineField({name: 'title', title: 'Title', type: 'string'}),
              defineField({name: 'text', title: 'Text', type: 'text', rows: 3}),
            ],
          }),
        ],
      }),
    ]),
    section('bottom', 'work', 'Selected work', [
      eyebrow,
      heading,
      defineField({
        name: 'items',
        title: 'Samples shown, in order',
        description: 'Pick work samples and a tile size. The grid looks best with the original mix of sizes.',
        type: 'array',
        of: [
          defineArrayMember({
            type: 'object',
            name: 'workTile',
            fields: [
              defineField({
                name: 'sample',
                title: 'Sample',
                type: 'reference',
                to: [{type: 'workSample'}],
                validation: (r) => r.required(),
              }),
              defineField({
                name: 'size',
                title: 'Tile size',
                type: 'string',
                options: {list: ['large', 'medium', 'small', 'wide'], layout: 'radio', direction: 'horizontal'},
                initialValue: 'small',
              }),
            ],
            preview: {
              select: {title: 'sample.title', size: 'size', media: 'sample.image'},
              prepare: ({title, size, media}) => ({title, subtitle: size, media}),
            },
          }),
        ],
      }),
    ]),
    section('bottom', 'writing', 'Recent articles', [
      eyebrow,
      heading,
      defineField({name: 'linkLabel', title: '"View all" link text', type: 'string'}),
      defineField({
        name: 'articles',
        title: 'Articles shown, in order',
        description: 'Leave empty to show the 4 newest articles automatically.',
        type: 'array',
        of: [defineArrayMember({type: 'reference', to: [{type: 'article'}]})],
      }),
    ]),
    section('bottom', 'contact', 'Contact', [
      defineField({name: 'backgroundWord', title: 'Big faded background text', type: 'string'}),
      eyebrow,
      heading,
      defineField({name: 'primaryButton', title: 'Upwork button text', type: 'string'}),
      defineField({name: 'secondaryButton', title: 'Email button text', type: 'string'}),
    ]),
  ],
  preview: {prepare: () => ({title: 'Home page'})},
})

export const editingPage = defineType({
  name: 'editingPage',
  title: 'Editing page',
  type: 'document',
  icon: EditIcon,
  fields: [
    defineField({name: 'header', title: 'Page header', type: 'pageHeader'}),
    defineField({name: 'videoCard', title: 'Video editing card', type: 'linkCard'}),
    defineField({name: 'staticCard', title: 'Static design card', type: 'linkCard'}),
    defineField({name: 'seo', title: 'Search & sharing', type: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Editing page'})},
})

export const videoPage = defineType({
  name: 'videoPage',
  title: 'Video editing page',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({name: 'header', title: 'Page header', type: 'pageHeader'}),
    sampleList('Drag to reorder. New videos you create are added at the end automatically, even if you forget to add them here.'),
    defineField({name: 'seo', title: 'Search & sharing', type: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Video editing page'})},
})

export const staticPage = defineType({
  name: 'staticPage',
  title: 'Static design page',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({name: 'header', title: 'Page header', type: 'pageHeader'}),
    sampleList('Drag to reorder. New images you create are added at the end automatically, even if you forget to add them here.'),
    defineField({name: 'seo', title: 'Search & sharing', type: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Static design page'})},
})

export const writingPage = defineType({
  name: 'writingPage',
  title: 'Writing page',
  type: 'document',
  icon: DocumentsIcon,
  fields: [
    defineField({name: 'header', title: 'Page header', type: 'pageHeader'}),
    defineField({
      name: 'articles',
      title: 'Articles, in order',
      description: 'Drag to reorder. New articles are added at the end automatically, even if you forget to add them here.',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'article'}]})],
    }),
    defineField({name: 'seo', title: 'Search & sharing', type: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Writing page'})},
})

export const SINGLETONS = ['siteSettings', 'homePage', 'editingPage', 'videoPage', 'staticPage', 'writingPage']
