import { HAIKUS, type Haiku } from './haikus'

export type { Haiku } from './haikus'
export { HAIKUS } from './haikus'

/**
 * A translation carries the poet who wrote the original; an original written
 * for the extension is shown unsigned. That distinction decides which poems get
 * a page of their own — a translation has provenance worth a page, three
 * unsigned lines do not.
 */
export type Translation = Haiku & { poet: string; romaji: string }

export const isTranslation = (h: Haiku): h is Translation =>
  typeof h.poet === 'string' && typeof h.romaji === 'string'

export const ORIGINALS = HAIKUS.filter((h) => !isTranslation(h))
export const TRANSLATIONS = HAIKUS.filter(isTranslation)

/**
 * The poem the server renders.
 *
 * Deliberately fixed rather than random. The page is statically generated, so
 * a "random" server pick would be frozen at build time anyway — and whatever it
 * froze on would be the poem every link preview and every crawler sees. Better
 * to choose it. The client swaps in a real random draw after mount.
 */
export const OPENING_HAIKU: Haiku = HAIKUS[0]

/** A different poem from the one showing, for the client to swap in. */
export function drawHaiku(exclude?: Haiku): Haiku {
  let next = HAIKUS[Math.floor(Math.random() * HAIKUS.length)]
  if (exclude && next === exclude) {
    next = HAIKUS[(HAIKUS.indexOf(next) + 1) % HAIKUS.length]
  }
  return next
}

const strip = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/**
 * The URL for a translation's page: the poet, then enough of the first line to
 * tell it from that poet's others. Bashō alone has two dozen here.
 */
export function slugOf(h: Translation): string {
  const words = strip(h.lines[0]).split('-').filter(Boolean).slice(0, 5)
  return `${strip(h.poet)}-${words.join('-')}`
}

export const TRANSLATION_SLUGS = new Map(TRANSLATIONS.map((h) => [slugOf(h), h]))

export const bySlug = (slug: string): Translation | undefined =>
  TRANSLATION_SLUGS.get(slug)
