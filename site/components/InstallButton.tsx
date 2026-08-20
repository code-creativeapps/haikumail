import { STORE_URL } from '@/lib/site'

/**
 * One control, two states, one constant. Until the Chrome Web Store listing is
 * approved there is no URL to point at, and pretending otherwise would send
 * people to a 404 — so the button says what is actually true.
 */
export function InstallButton({ size = 'large' }: { size?: 'large' | 'small' }) {
  const className = `hk-install ${size === 'small' ? 'hk-install-small' : ''}`

  if (!STORE_URL) {
    return (
      <span className={`${className} hk-install-pending`} aria-disabled="true">
        Coming to the Chrome Web Store
      </span>
    )
  }

  return (
    <a className={className} href={STORE_URL} rel="noopener">
      Add to Chrome — free
    </a>
  )
}

export function InstallNote() {
  return (
    <p className="hk-install-note">
      No account. No sign-in. One permission: <code>mail.google.com</code>.
    </p>
  )
}
