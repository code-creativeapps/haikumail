import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer, Header } from '@/components/Chrome'
import { CONTACT_EMAIL, REPO_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Terms',
  description:
    'The terms for using the HaikuMail extension and this website. Short, because there is not much to agree to.',
  alternates: { canonical: '/terms' },
}

const UPDATED = '20 August 2026'

export default function Terms() {
  return (
    <>
      <Header />
      <main className="hk-shell">
        <article className="hk-prose">
          <h1>Terms</h1>
          <p className="hk-dateline">Last updated {UPDATED}</p>

          <p className="hk-lede">
            Short, because there is not much to agree to. The extension is free and runs
            entirely on your own machine; the only thing this site can take from you is an
            email address you choose to type in.
          </p>

          <h2>The extension</h2>
          <p>
            HaikuMail is free, and its source is published under the MIT licence — you may
            read it, run it, modify it and redistribute it on those terms. The licence
            text is in the{' '}
            <a href={REPO_URL} rel="noopener">
              repository
            </a>
            .
          </p>
          <p>
            It is provided as is, without warranty. It works by reading the page Gmail
            draws in your browser, which means it depends on Gmail continuing to draw that
            page in roughly the way it does today. Google can change that at any time and
            without notice, and if they do, parts of the extension will stop working until
            it is updated. Nothing here promises otherwise.
          </p>
          <p>
            HaikuMail is not affiliated with, endorsed by, or connected to Google. Gmail
            is a trademark of Google LLC. Use of the extension is also subject to
            Google&rsquo;s own terms for the service you are using it on.
          </p>
          <p>
            The extension masks your inbox on purpose. Please do not rely on it as the
            only way you would find out about something urgent — it is designed to make
            mail harder to check, which is the whole point, and that is a poor property
            for an alerting system.
          </p>

          <h2>The poems</h2>
          <p>
            The 100 original haiku were written for this project. The 57 translations were
            made here from Japanese originals that have been in the public domain for
            centuries; the translations themselves are new work and are labelled as
            machine translations wherever they appear. Both sets are covered by the same
            MIT licence as the code — you may quote and reuse them, with attribution.
          </p>

          <h2>This website</h2>
          <p>
            You may use the site for its obvious purpose. Please do not attempt to break
            it, script the signup form, or use it to send confirmation mail to addresses
            that are not yours.
          </p>
          <p>
            The waitlist is a statement of interest, not a contract. It does not entitle
            you to a place, a price, or a date, and there is no obligation on either side.
            What happens to the address you give is covered by the{' '}
            <Link href="/privacy">privacy policy</Link>.
          </p>

          <h2>The hosted version</h2>
          <p>
            The hosted version described on this site does not exist yet. Anything written
            about it is a description of intent and may change entirely or not happen at
            all. No payment is being taken and no promise is being made.
          </p>

          <h2>Liability</h2>
          <p>
            To the extent the law allows, nothing here is liable for lost mail, missed
            messages, lost time, or any indirect or consequential loss arising from using
            a free extension whose stated purpose is to stop you reading your email. Your
            statutory rights as a consumer are unaffected.
          </p>

          <h2>Changes and contact</h2>
          <p>
            These terms may change; the date at the top moves when they do. Questions to{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </article>
      </main>
      <Footer />
    </>
  )
}
