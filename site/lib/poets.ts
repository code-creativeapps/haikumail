/**
 * Context for the poets whose work is translated here.
 *
 * Deliberately limited to the standard, uncontroversial biography — dates, what
 * they are known for, where they sit relative to each other. A page carrying an
 * invented reading of a particular poem would be worse than a page carrying
 * none: the whole claim of this section is that the translations can be checked
 * rather than trusted, and that falls apart if the surrounding prose is made up.
 */
export type Poet = {
  name: string
  dates: string
  note: string
}

export const POETS: Record<string, Poet> = {
  Bashō: {
    name: 'Matsuo Bashō',
    dates: '1644–1694',
    note: 'The figure who turned the opening verse of a linked-verse sequence into a form that could stand alone. He spent much of his later life travelling on foot through Japan, and the journal of one of those journeys, Oku no Hosomichi — usually The Narrow Road to the Deep North — is the most widely read work in the tradition.',
  },
  Buson: {
    name: 'Yosa Buson',
    dates: '1716–1784',
    note: 'A professional painter as well as a poet, and it shows: his verses tend to compose like pictures, with a foreground, a distance and a deliberate use of colour. He led the revival of Bashō’s style a generation after it had fallen out of fashion.',
  },
  Issa: {
    name: 'Kobayashi Issa',
    dates: '1763–1828',
    note: 'Known for turning his attention to small and overlooked creatures — flies, frogs, sparrows — and addressing them directly. His life held an unusual amount of loss, and the warmth in the poems is generally read against it rather than apart from it.',
  },
  Shiki: {
    name: 'Masaoka Shiki',
    dates: '1867–1902',
    note: 'The reason the form is called haiku at all: he separated the standalone verse from its linked-verse origins and named it. He argued for shasei, sketching directly from life, against what he saw as inherited poetic convention. He wrote much of his best-known work bedridden with tuberculosis, and died at thirty-four.',
  },
  'Chiyo-ni': {
    name: 'Fukuda Chiyo-ni',
    dates: '1703–1775',
    note: 'The most widely read woman in the tradition, and a Buddhist nun in later life. She was recognised as a poet while still young, at a time when very few women were published at all.',
  },
  Ryōkan: {
    name: 'Ryōkan',
    dates: '1758–1831',
    note: 'A Zen monk who lived most of his life as a hermit, declining positions and possessions. His poems and his calligraphy are both prized for a plainness that took a great deal of discipline to arrive at.',
  },
  Onitsura: {
    name: 'Uejima Onitsura',
    dates: '1661–1738',
    note: 'A contemporary of Bashō, working independently of him, who argued that a verse without makoto — sincerity, or truth to what was actually seen — was not a poem however skilful.',
  },
  Moritake: {
    name: 'Arakida Moritake',
    dates: '1473–1549',
    note: 'A Shinto priest at the Ise Shrine, and the earliest poet in this collection by well over a century. He worked in haikai when it was still comic linked verse, before anything like Bashō’s seriousness had been brought to it.',
  },
  Gyōdai: {
    name: 'Katō Gyōdai',
    dates: '1732–1792',
    note: 'Of the Nagoya school, and part of the same eighteenth-century revival of Bashō’s manner that Buson led from Kyoto.',
  },
}

export const poetOf = (name: string): Poet =>
  POETS[name] ?? { name, dates: '', note: '' }
