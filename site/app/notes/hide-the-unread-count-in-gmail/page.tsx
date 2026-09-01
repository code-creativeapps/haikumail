import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer, Header } from '@/components/Chrome'
import { InstallButton } from '@/components/InstallButton'
import { JsonLd } from '@/components/JsonLd'
import { noteBySlug } from '@/lib/notes'
import { SITE_URL } from '@/lib/site'

const note = noteBySlug('hide-the-unread-count-in-gmail')!

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
          '@type': 'HowTo',
          '@id': `${SITE_URL}/notes/${note.slug}`,
          name: note.title,
          description: note.description,
          datePublished: note.published,
          inLanguage: 'en',
          step: [
            {
              '@type': 'HowToStep',
              name: 'Turn off the unread message icon and badge',
              text: 'Open Gmail settings, go to the Advanced tab, set “Unread message icon and badge” to Disable, and click Save Changes.',
            },
            {
              '@type': 'HowToStep',
              name: 'Change what the inbox unread count counts',
              text: 'In the Inbox tab, use “Inbox unread count” to choose which unread items the sidebar number reflects. This appears when the inbox type has sections.',
            },
          ],
        }}
      />
      <Header />
      <main className="hk-shell hk-prose hk-narrow">
        <h1>{note.title}</h1>
        <p className="hk-note-meta">
          <time dateTime={note.published}>1 September 2026 · checked against Gmail on this date</time>
        </p>

        <p>
          There are two settings, and they do different things. Most guides describe
          only the first, under a name Google stopped using, in a settings tab that no
          longer exists. And neither of them touches the number in your browser tab,
          which — if you are like most people who search for this — is the one actually
          bothering you.
        </p>
        <p>Here is all of it, in order.</p>

        <h2>1. The badge on the Gmail icon</h2>
        <p>
          This is the little count that rides on the Gmail favicon in the tab strip, and
          on the app badge if you have installed Gmail as an app.
        </p>
        <ul>
          <li>Open Gmail and click the gear, then <strong>See all settings</strong>.</li>
          <li>
            Go to the <strong>Advanced</strong> tab.
          </li>
          <li>
            Find <strong>Unread message icon and badge</strong> and choose{' '}
            <strong>Disable</strong>.
          </li>
          <li>
            Click <strong>Save Changes</strong> at the bottom. Gmail will reload.
          </li>
        </ul>
        <p>
          <strong>Why other guides send you the wrong way:</strong> this used to be a
          Gmail Labs experiment called simply &ldquo;Unread message icon&rdquo;, and
          most of the results you will find still tell you to look in a{' '}
          <strong>Labs</strong> tab. That tab is gone — the old{' '}
          <code>#settings/labs</code> address now redirects to Advanced — and the
          setting has been renamed to include &ldquo;and badge&rdquo;. If you have been
          scrolling the Labs tab looking for it, that is why you could not find it.
        </p>

        <h2>2. What the sidebar number counts</h2>
        <p>
          The bold number beside <strong>Inbox</strong> in the left sidebar is a separate
          thing, and you can change what it counts.
        </p>
        <ul>
          <li>
            In settings, go to the <strong>Inbox</strong> tab.
          </li>
          <li>
            Find <strong>Inbox unread count</strong>. There are three choices:{' '}
            <em>Unread items in the first section</em>, <em>Unread items in the inbox</em>,
            and <em>Unread items in the first section and inbox</em> — the last shows a
            pair like <code>2 : 3</code>.
          </li>
          <li>
            Save Changes.
          </li>
        </ul>
        <p>
          <strong>A catch worth knowing:</strong> this row only appears when your inbox
          has sections. Under <strong>Inbox type</strong> the options are Default,
          Important first, Unread first, Starred first, Priority Inbox and Multiple
          Inboxes — and if you are on Default, there are no sections, so there is
          nothing here to configure. Choosing <em>Unread items in the first section</em>{' '}
          is the closest Gmail gets to a smaller number: it counts only what is in your
          top section rather than everything.
        </p>
        <p>
          What none of these options do is remove the number. Gmail has no setting that
          hides the unread count outright.
        </p>

        <h2>3. The tab title — and why you cannot fix it</h2>
        <p>
          Here is the part the other guides leave out. Gmail writes the count into the{' '}
          <em>page title</em>, so your browser tab reads something like{' '}
          <code>Inbox (1,247)</code>. That title is what you see in the tab strip, in
          your window switcher, and in your history.
        </p>
        <p>
          <strong>Neither setting above changes it.</strong> Disabling the badge removes
          the mark on the icon; the title keeps the number. There is no Gmail setting
          for the title, because Gmail does not consider it a setting.
        </p>
        <p>
          So if you turned off the badge and felt like nothing had happened — nothing
          much had. The number you were looking at was in the title all along.
        </p>

        <h2>What actually works</h2>
        <p>
          Being honest about the ceiling: within Gmail you can turn off the badge and
          narrow what the sidebar counts. You cannot remove the count from the tab
          title, and you cannot stop the inbox from being a list of things wanting
          attention. For that you need something outside Gmail&rsquo;s settings.
        </p>
        <p>
          Which is roughly why this site exists.{' '}
          <Link href="/">HaikuMail</Link> is a Chrome extension that replaces the tab
          title and the favicon outright, so the tab stops being a notification, and
          hides the inbox behind a search box — nothing appears until you ask for it. A
          haiku holds the first thirty seconds, which is usually long enough to remember
          you did not need anything.
        </p>
        <p>
          It is free, it has no account, and it asks for one permission:{' '}
          <code>mail.google.com</code>. What it can and cannot see is{' '}
          <Link href="/notes/what-the-extension-can-and-cannot-see">
            written out in full
          </Link>
          .
        </p>

        <p className="hk-note-cta">
          <InstallButton />
        </p>
      </main>
      <Footer />
    </>
  )
}
