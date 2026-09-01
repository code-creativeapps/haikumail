import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer, Header } from '@/components/Chrome'
import { JsonLd } from '@/components/JsonLd'
import { InstallButton } from '@/components/InstallButton'
import { noteBySlug } from '@/lib/notes'
import { SITE_URL } from '@/lib/site'

const note = noteBySlug('why-a-thirty-second-wait-works')!

export const metadata: Metadata = {
  title: note.title,
  description: note.description,
  alternates: { canonical: `/notes/${note.slug}` },
  openGraph: { type: 'article', publishedTime: note.published },
}

export default function Note() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          '@id': `${SITE_URL}/notes/${note.slug}`,
          headline: note.title,
          description: note.description,
          datePublished: note.published,
          inLanguage: 'en',
          author: { '@type': 'Organization', name: 'HaikuMail' },
        }}
      />
      <Header />
      <main className="hk-shell hk-prose hk-narrow">
        <h1>{note.title}</h1>
        <p className="hk-note-meta">
          <time dateTime={note.published}>1 September 2026</time>
        </p>

        <p>
          Most people who install a website blocker uninstall it within a fortnight.
          Usually not in a moment of weakness — in a moment of legitimate need. You
          genuinely have to send that email, the blocker genuinely will not let you,
          and once it is off it tends to stay off.
        </p>
        <p>
          The design mistake is easy to miss, because the tool appears to be working
          right up until it does not.
        </p>

        <h2>A blocker asks for the thing you have run out of</h2>
        <p>
          You do not open your inbox forty times a day because you decided to. You open
          it during a compile, between two hard paragraphs, in the four seconds after a
          meeting ends — moments when the work in front of you got briefly
          uncomfortable and your hand moved before you did.
        </p>
        <p>
          A blocker meets you at exactly that point and demands a decision:{' '}
          <em>am I going to override this?</em> That is a small act of self-control,
          asked for at the precise moment you had none available. And every time you
          override it, overriding becomes slightly more normal, until the blocker is
          furniture.
        </p>
        <p>
          Worse, it is asked of you dozens of times a day. No amount of discipline
          survives being taxed at that rate.
        </p>

        <h2>A delay asks for nothing</h2>
        <p>
          HaikuMail does not stop you reaching your mail. It puts thirty seconds in
          front of it, shows you a poem, and gets out of the way.
        </p>
        <p>
          There is no decision. Nothing to resist, nothing to override, no willpower
          spent. You wait, or you close the tab. The interesting part is how often it
          is the second one — because the impulse that carried you to the inbox has a
          half-life of a few seconds, and thirty is much longer than a few.
        </p>
        <p>
          What the wait does is simple: it outlasts the impulse. By the time the box
          opens, the thing that made you open it has usually evaporated, and you are
          left looking at a poem and remembering what you were actually doing.
        </p>

        <h2>Why it has to cost the same every time</h2>
        <p>
          The single most important rule in the whole design:{' '}
          <strong>reloading does not skip the wait. It restarts it.</strong>
        </p>
        <p>
          If a reload were cheaper than waiting, the reload becomes the way in, and
          within a week the tool is decorative. Every route in costs thirty seconds —
          new tab, reload, coming back after unmasking. No path is cheaper than any
          other, so there is no technique to discover, and nothing to get good at.
        </p>
        <p>
          It also means the wait is not a punishment. It is a toll, and it is the same
          toll for everyone, including the times you genuinely need the mail. That is
          what keeps it from feeling adversarial.
        </p>

        <h2>Why there is an escape hatch</h2>
        <p>
          One link drops the mask and gives you the real Gmail for that tab. This
          surprises people — surely that defeats it?
        </p>
        <p>
          It is the reason it survives. The blocker failed because it made an enemy of
          your legitimate needs. Sometimes you really do have to send the invoice.
          HaikuMail lets you, immediately, without a fight and without uninstalling
          anything.
        </p>
        <p>
          Coming back restarts the thirty seconds, so the hatch is not a shortcut — but
          it does mean the tool never becomes the thing standing between you and your
          job. A tool you never have to remove is one you still have in six months.
        </p>

        <h2>Why a poem, and not a countdown</h2>
        <p>
          A bare timer is a closed door with a clock on it, and thirty seconds of
          staring at a number is thirty seconds of being annoyed.
        </p>
        <p>
          A haiku arrives a line at a time and takes about as long to read as the wait
          takes to pass. It gives the time somewhere to go. Occasionally it is even the
          better part of the visit — which is a strange thing to say about email, and
          the reason the poems were worth{' '}
          <Link href="/notes/where-famous-haiku-translations-come-from">
            translating properly
          </Link>{' '}
          rather than lifting.
        </p>
        <p>
          None of this is a claim about anyone else&rsquo;s attention but my own. It was
          built because I kept checking, and the thirty seconds is the only thing I
          tried that I did not eventually switch off.
        </p>

        <p className="hk-note-cta">
          <InstallButton />
        </p>
      </main>
      <Footer />
    </>
  )
}
