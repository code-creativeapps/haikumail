/**
 * Structured data. Next has no first-class API for JSON-LD; a script tag in a
 * server component is the documented way, and the content is ours rather than
 * user input.
 *
 * Deliberately absent: `aggregateRating`. Inventing one is a manual-action risk
 * and the commonest way a small site loses its rich results. It goes in when
 * the Web Store has real reviews to source it from.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
