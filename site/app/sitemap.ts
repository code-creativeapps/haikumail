import type { MetadataRoute } from 'next'
import { slugOf, TRANSLATIONS } from '@/lib/haiku'
import { NOTES } from '@/lib/notes'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${SITE_URL}${path}`

  return [
    { url: url('/'), priority: 1, changeFrequency: 'monthly' },
    { url: url('/haiku'), priority: 0.7, changeFrequency: 'yearly' },
    { url: url('/privacy'), priority: 0.3, changeFrequency: 'yearly' },
    { url: url('/terms'), priority: 0.3, changeFrequency: 'yearly' },
    ...NOTES.map((n) => ({
      url: url(`/notes/${n.slug}`),
      lastModified: new Date(n.published),
      priority: 0.6,
      changeFrequency: 'yearly' as const,
    })),
    ...TRANSLATIONS.map((h) => ({
      url: url(`/haiku/${slugOf(h)}`),
      priority: 0.4,
      changeFrequency: 'yearly' as const,
    })),
  ]
}
