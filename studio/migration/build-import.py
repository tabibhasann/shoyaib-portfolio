"""One-off migration (2026-11-21): turn the original hand-written HTML pages into Sanity documents.

Usage (from the repo root):
    python3 -I studio/migration/build-import.py <folder with the original html> > studio/migration/import.ndjson
    (cd studio && npx sanity dataset import migration/import.ndjson production --replace)

The original HTML is in git history (commit b593a77 and earlier). Kept for reference only.
"""
import html
import json
import os
import re
import sys
import uuid
from html.parser import HTMLParser

SRC = sys.argv[1]
ASSETS = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'assets'))


def key():
    return uuid.uuid4().hex[:12]


def read(rel):
    return open(os.path.join(SRC, rel), encoding='utf-8').read()


def meta(page, attr, name):
    m = re.search(rf'<meta {attr}="{re.escape(name)}" content="([^"]*)"', page)
    return html.unescape(m.group(1)) if m else None


def seo(page):
    t = re.search(r'<title>([^<]*)</title>', page)
    d = meta(page, 'name', 'description')
    og = meta(page, 'property', 'og:description')
    return {
        '_type': 'seo',
        'title': html.unescape(t.group(1)),
        'description': d,
        **({'shareDescription': og} if og and og != d else {}),
    }


def asset(kind, rel):
    """Reference that `sanity dataset import` turns into an uploaded image/file."""
    return f'{kind}@file://{os.path.join(ASSETS, rel)}'


def ref(_id):
    return {'_type': 'reference', '_ref': _id, '_key': key()}


# ---------------------------------------------------------------- article bodies -> Portable Text
class BodyParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.blocks, self.block, self.marks, self.links = [], None, [], {}
        self.list_type, self.table, self.row, self.cell = None, None, None, None
        self.in_article = False

    def start_block(self, style='normal', list_item=None):
        self.block = {'_type': 'block', '_key': key(), 'style': style, 'markDefs': [], 'children': []}
        if list_item:
            self.block.update(listItem=list_item, level=1)

    def end_block(self):
        b = self.block
        if b and b['children']:
            b['children'][0]['text'] = b['children'][0]['text'].lstrip()
            b['children'][-1]['text'] = b['children'][-1]['text'].rstrip()
            b['children'] = [c for c in b['children'] if c['text']]
            if b['children']:
                self.blocks.append(b)
        self.block = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'article':
            self.in_article = True
        if not self.in_article:
            return
        if tag == 'p':
            self.start_block()
        elif tag == 'h3':
            self.start_block('h3')
        elif tag in ('ul', 'ol'):
            self.list_type = 'bullet' if tag == 'ul' else 'number'
        elif tag == 'li':
            self.start_block(list_item=self.list_type)
        elif tag in ('strong', 'b'):
            self.marks.append('strong')
        elif tag in ('em', 'i'):
            self.marks.append('em')
        elif tag == 'a' and self.block is not None:
            k = key()
            self.block['markDefs'].append({'_type': 'link', '_key': k, 'href': a.get('href')})
            self.marks.append(k)
        elif tag == 'table':
            self.table = {'_type': 'table', '_key': key(), 'rows': []}
        elif tag == 'tr':
            self.row = {'_type': 'row', '_key': key(), 'cells': []}
        elif tag in ('td', 'th'):
            self.cell = ''

    def handle_endtag(self, tag):
        if tag == 'article':
            self.in_article = False
        if not self.in_article:
            return
        if tag in ('p', 'h3', 'li'):
            self.end_block()
        elif tag in ('ul', 'ol'):
            self.list_type = None
        elif tag in ('strong', 'b', 'em', 'i', 'a') and self.marks:
            self.marks.pop()
        elif tag in ('td', 'th'):
            self.row['cells'].append(re.sub(r'\s+', ' ', self.cell).strip())
            self.cell = None
        elif tag == 'tr':
            self.table['rows'].append(self.row)
        elif tag == 'table':
            self.blocks.append(self.table)
            self.table = None

    def handle_data(self, data):
        if self.cell is not None:
            self.cell += data
            return
        if self.block is None:
            return
        text = re.sub(r'\s+', ' ', data)
        if not text:
            return
        kids = self.block['children']
        marks = list(self.marks)
        if kids and kids[-1]['marks'] == marks:
            kids[-1]['text'] += text
        else:
            kids.append({'_type': 'span', '_key': key(), 'text': text, 'marks': marks})


def body(page):
    p = BodyParser()
    p.feed(page)
    return p.blocks


# ---------------------------------------------------------------- documents
docs = []
home = read('index.html')

UPWORK = 'https://www.upwork.com/freelancers/~01d717d1dbe07f59e1?viewMode=1'
docs.append({
    '_id': 'siteSettings', '_type': 'siteSettings',
    'name': 'Shoyaib',
    'tagline': 'Shoyaib — Editor & Writer',
    'email': 'shoyaibr@gmail.com',
    'upworkUrl': UPWORK,
    'location': 'Dhaka, Bangladesh',
    'personDescription': 'Freelance editor, writer & digital marketer based in Dhaka, Bangladesh.',
    'shareImage': {'_type': 'image', '_sanityAsset': asset('image', 'images/profile/upwork-profile-card.png')},
})

# Work samples: (file, kind, gallery title, gallery tag, home title, alt)
SAMPLES = [
    ('health-tips-2.mp4', 'video', 'Health Tips — Episode 2', 'Health Tips', None, None),
    ('health-tips-protein.mp4', 'video', 'Protein Health Tips', 'Health Tips', 'Health Tips — Protein', None),
    ('premier-package-promo.mp4', 'video', 'Premier Package Promo', 'Promotional', None, None),
    ('standard-package-promo.mp4', 'video', 'Standard Package Promo', 'Promotional', None, None),
    ('malaria-awareness-day.png', 'image', 'Malaria Awareness Day', 'Healthcare Campaign', None, 'Malaria Awareness Day campaign visual'),
    ('dental-clinic-promo.png', 'image', 'Dental Clinic Promo', 'Service Promotion', None, 'Dental clinic promotional visual'),
    ('protein-health-tips.png', 'image', 'Protein Health Tips', 'Health Education', None, 'Protein health tips static design'),
    ('pre-hajj-health-checkup.png', 'image', 'Pre-Hajj Health Checkup', 'Health Package', 'Pre-Hajj Health Package', 'Pre-Hajj health checkup package visual'),
]
sid = lambda f: 'sample-' + f.rsplit('.', 1)[0]
for f, kind, title, tag, home_title, alt in SAMPLES:
    d = {'_id': sid(f), '_type': 'workSample', 'title': title, 'kind': kind, 'tag': tag}
    if home_title:
        d['homeTitle'] = home_title
    if alt:
        d['alt'] = alt
    if kind == 'video':
        d['video'] = {'_type': 'file', '_sanityAsset': asset('file', f'videos/video-editing/{f}')}
    else:
        d['image'] = {'_type': 'image', '_sanityAsset': asset('image', f'images/static-design/{f}')}
    docs.append(d)

# Articles
ARTICLES = [  # slug, short title on the home page (if different)
    ('marketing-funnel', 'Understanding the Marketing Funnel'),
    ('reflection-2025', None),
    ('stop-thinking-start-doing', 'Stop Thinking, Start Doing'),
    ('what-is-mph', None),
]
for slug, short in ARTICLES:
    page = read(f'writing/{slug}.html')
    title = html.unescape(re.search(r'<h1>([^<]*)</h1>', page).group(1)).strip()
    d = {
        '_id': f'article-{slug}', '_type': 'article',
        'title': title,
        'slug': {'_type': 'slug', 'current': slug},
        'category': html.unescape(re.search(r'<p class="eyebrow">([^<]*)</p>', page).group(1)).strip(),
        'date': re.search(r'<time class="meta-date" datetime="([^"]+)"', page).group(1),
        'subtitle': html.unescape(re.search(r'<p class="article-hero-sub">([^<]*)</p>', page).group(1)).strip(),
        'body': body(page),
        'seo': seo(page),
    }
    if short and short != title:
        d['shortTitle'] = short
    docs.append(d)

docs.append({
    '_id': 'homePage', '_type': 'homePage',
    'seo': seo(home),
    'hero': {
        'backgroundWord': 'SHOYAIB',
        'eyebrow': 'Freelance Editor · Writer · Digital Marketer',
        'headline': 'Words that *move*,\nstories that *stay*.',
        'intro': "I'm Shoyaib — a freelance editor and writer based in Dhaka, Bangladesh. I help brands and creators sharpen their message, polish their content, and tell stories that feel effortless and real.",
        'facts': [
            {'_key': key(), '_type': 'fact', 'label': 'Based in', 'value': 'Dhaka, Bangladesh'},
            {'_key': key(), '_type': 'fact', 'label': 'Available for', 'value': 'Freelance & Remote'},
            {'_key': key(), '_type': 'fact', 'label': 'Verified on', 'value': 'Upwork'},
        ],
    },
    'marquee': ['Editing', 'Writing', 'Digital Marketing', 'Content Strategy', 'Video Editing', 'Copywriting'],
    'about': {
        'eyebrow': '01 — About',
        'mainText': "I turn rough ideas into *clear, polished content* that people actually want to read. Whether it's an article, a video edit, or a campaign visual — I focus on flow, clarity, and making sure every word earns its place.",
        'secondaryText': "Over the past two years, I've worked with clients on Upwork, built content for healthcare brands, and written about marketing, mindset, and public health. I believe good content isn't just about sounding smart — it's about being understood.",
        'stats': [
            {'_key': key(), '_type': 'stat', 'value': 6.5, 'decimals': 1, 'unit': 'IELTS', 'label': 'English Proficiency'},
            {'_key': key(), '_type': 'stat', 'prefix': '$', 'value': 2, 'decimals': 0, 'suffix': 'K+', 'label': 'Earned on Upwork'},
            {'_key': key(), '_type': 'stat', 'value': 14, 'decimals': 0, 'label': 'Projects Completed'},
            {'_key': key(), '_type': 'stat', 'value': 82, 'decimals': 0, 'suffix': 'h', 'label': 'Hours Worked'},
        ],
    },
    'services': {
        'eyebrow': '02 — Services',
        'heading': 'Two crafts, one standard.',
        'intro': "I keep my focus narrow so the quality stays high. Here's what I do best.",
        'editingCard': {'_type': 'linkCard', 'title': 'Editing', 'linkLabel': 'View Editing Work',
                        'text': 'Video editing and static design — reels, health tips, promotional content, campaign visuals, and branded social media creatives that feel polished and ready to share.'},
        'writingCard': {'_type': 'linkCard', 'title': 'Writing', 'linkLabel': 'View Writing Work',
                        'text': 'Articles, website copy, and content with a clear message and a style that matches your purpose — from marketing guides to personal essays and educational pieces.'},
    },
    'process': {
        'eyebrow': '03 — How I Work',
        'heading': 'Simple process, serious craft.',
        'steps': [
            {'_key': key(), '_type': 'step', 'title': 'Brief & Discover', 'text': 'We start with a conversation. You share the goal, the audience, and the tone. I ask questions, review references, and map out the direction before touching anything.'},
            {'_key': key(), '_type': 'step', 'title': 'Draft & Refine', 'text': "First draft fast, second draft sharp. I build the structure, fill in the substance, then cut what doesn't earn its place. You get a review round with clear tracked changes."},
            {'_key': key(), '_type': 'step', 'title': 'Polish & Deliver', 'text': 'Final pass for flow, grammar, and formatting. You receive the finished piece ready to publish — plus any source files or variations you need.'},
        ],
    },
    'work': {
        'eyebrow': '04 — Selected Work',
        'heading': "A glimpse of what I've made.",
        'items': [
            {'_key': key(), '_type': 'workTile', 'size': size, 'sample': {'_type': 'reference', '_ref': sid(f)}}
            for f, size in [
                ('health-tips-2.mp4', 'large'), ('malaria-awareness-day.png', 'medium'),
                ('dental-clinic-promo.png', 'small'), ('health-tips-protein.mp4', 'small'),
                ('premier-package-promo.mp4', 'small'), ('protein-health-tips.png', 'wide'),
                ('pre-hajj-health-checkup.png', 'small'), ('standard-package-promo.mp4', 'medium'),
            ]
        ],
    },
    'writing': {
        'eyebrow': '05 — Writing',
        'heading': 'Recent articles.',
        'linkLabel': 'View All Writing →',
        'articles': [ref(f'article-{s}') for s, _ in ARTICLES],
    },
    'contact': {
        'backgroundWord': "LET'S TALK",
        'eyebrow': "06 — Let's Work",
        'heading': "Got a project?\n*Let's make it* happen.",
        'primaryButton': 'View Upwork Profile',
        'secondaryButton': 'Send an Email',
    },
})

ed = read('editing/index.html')
docs.append({
    '_id': 'editingPage', '_type': 'editingPage', 'seo': seo(ed),
    'header': {'_type': 'pageHeader', 'eyebrow': 'Editing Portfolio',
               'heading': 'Eye-catching edits for *video* and *static* content.',
               'intro': 'A selection of video edits and design work — from health tips reels to campaign visuals and branded social media creatives. Each piece is built for clarity, engagement, and a polished finish.'},
    'videoCard': {'_type': 'linkCard', 'title': 'Video Editing', 'linkLabel': 'View Video Samples',
                  'text': 'Reels, health tips videos, promotional content, and short-form visual storytelling — edited for engagement and clarity.'},
    'staticCard': {'_type': 'linkCard', 'title': 'Static Design', 'linkLabel': 'View Static Samples',
                   'text': 'Posters, branded posts, thumbnails, and campaign visuals — designed for strong messaging and professional presentation.'},
})
docs.append({
    '_id': 'videoPage', '_type': 'videoPage', 'seo': seo(read('editing/video-editing.html')),
    'header': {'_type': 'pageHeader', 'eyebrow': 'Video Editing', 'heading': 'Short-form edits that *engage*.',
               'intro': 'Selected video editing work — health tips content, service promos, and campaign-based visual storytelling. Hover to preview, click to watch in full.'},
    'samples': [ref(sid(f)) for f, kind, *_ in SAMPLES if kind == 'video'],
})
docs.append({
    '_id': 'staticPage', '_type': 'staticPage', 'seo': seo(read('editing/static-design.html')),
    'header': {'_type': 'pageHeader', 'eyebrow': 'Static Design', 'heading': 'Visuals with *purpose*, design with *clarity*.',
               'intro': 'Posters, awareness creatives, campaign visuals, and branded social media content — each designed for strong messaging and professional presentation. Click to view full size.'},
    'samples': [ref(sid(f)) for f, kind, *_ in SAMPLES if kind == 'image'],
})
docs.append({
    '_id': 'writingPage', '_type': 'writingPage', 'seo': seo(read('writing/index.html')),
    'header': {'_type': 'pageHeader', 'eyebrow': 'Writing Portfolio', 'heading': 'Clear writing with *structure*, flow, and purpose.',
               'intro': 'Articles and essays on marketing, mindset, personal growth, and public health — written to be read, not just skimmed.'},
    'articles': [ref(f'article-{s}') for s, _ in ARTICLES],
})

for d in docs:
    print(json.dumps(d, ensure_ascii=False))
