import Link from 'next/link'
import { Lockup } from './Logo'
import { CONTACT_EMAIL, REPO_URL } from '@/lib/site'

export function Header() {
  return (
    <header className="hk-shell hk-header">
      <Link href="/" aria-label="HaikuMail home">
        <Lockup />
      </Link>
      <nav className="hk-nav">
        <Link href="/haiku">Haiku</Link>
        <a href={REPO_URL} rel="noopener">
          Source
        </a>
      </nav>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="hk-shell hk-footer">
      <Lockup size={20} />
      <ul className="hk-footer-links">
        <li>
          <Link href="/haiku">The haiku</Link>
        </li>
        <li>
          </li>
        <li>
          <Link href="/privacy">Privacy</Link>
        </li>
        <li>
          <Link href="/terms">Terms</Link>
        </li>
        <li>
          <a href={REPO_URL} rel="noopener">
            Source
          </a>
        </li>
        <li>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </li>
      </ul>
      <p className="hk-colophon">Made because I kept checking.</p>
    </footer>
  )
}
