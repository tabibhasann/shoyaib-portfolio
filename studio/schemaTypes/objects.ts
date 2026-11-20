import {defineArrayMember, defineField, defineType} from 'sanity'

const ACCENT_HELP = 'Wrap a word in *stars* to show it in the orange/italic accent style.'

/** Title + description used by Google and by link previews (WhatsApp, LinkedIn…). */
export const seo = defineType({
  name: 'seo',
  title: 'Search & sharing',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'title',
      title: 'Browser tab / Google title',
      type: 'string',
      validation: (r) => r.max(70).warning('Google cuts titles longer than about 60–70 characters.'),
    }),
    defineField({
      name: 'description',
      title: 'Google description',
      type: 'text',
      rows: 3,
      validation: (r) => r.max(170).warning('Keep it under about 160 characters.'),
    }),
    defineField({
      name: 'shareDescription',
      title: 'Description for link previews',
      description: 'Shown when the link is shared on WhatsApp, LinkedIn, Facebook… Leave empty to reuse the Google description.',
      type: 'text',
      rows: 2,
    }),
  ],
})

/** Small label + big heading + intro paragraph used at the top of the inner pages. */
export const pageHeader = defineType({
  name: 'pageHeader',
  title: 'Page header',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Small label above the heading', type: 'string'}),
    defineField({
      name: 'heading',
      title: 'Heading',
      description: ACCENT_HELP,
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({name: 'intro', title: 'Intro paragraph', type: 'text', rows: 3}),
  ],
})

export const linkCard = defineType({
  name: 'linkCard',
  title: 'Card',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'text', title: 'Text', type: 'text', rows: 3}),
    defineField({name: 'linkLabel', title: 'Link text', type: 'string'}),
  ],
})

/** A table inside an article (e.g. the salary table in "What Is MPH?"). */
export const table = defineType({
  name: 'table',
  title: 'Table',
  type: 'object',
  fields: [
    defineField({
      name: 'rows',
      title: 'Rows',
      description: 'The first row is the header row. Every row should have the same number of cells.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'row',
          fields: [defineField({name: 'cells', title: 'Cells', type: 'array', of: [{type: 'string'}]})],
          preview: {
            select: {cells: 'cells'},
            prepare: ({cells}) => ({title: (cells || []).join('  |  ')}),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {rows: 'rows'},
    prepare: ({rows}) => ({
      title: 'Table',
      subtitle: `${(rows || []).length} rows`,
    }),
  },
})

/** Rich text for article bodies. Kept to what the site's design supports. */
export const articleBody = defineType({
  name: 'articleBody',
  title: 'Article text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Paragraph', value: 'normal'},
        {title: 'Heading', value: 'h3'},
      ],
      lists: [
        {title: 'Bullet list', value: 'bullet'},
        {title: 'Numbered list', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'href',
                title: 'Web address',
                type: 'url',
                validation: (r) => r.uri({scheme: ['http', 'https', 'mailto']}),
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({type: 'table'}),
  ],
})
