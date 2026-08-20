/**
 * Everything about the site that a page might want to state, in one place —
 * mostly so the Chrome Web Store URL has exactly one home. Until the listing
 * is approved there is no URL, and `STORE_URL` being null is what puts every
 * install control into its "not yet" state.
 */

export const SITE_URL = 'https://haikumail.app'
export const SITE_NAME = 'HaikuMail'
export const REPO_URL = 'https://github.com/code-creativeapps/haikumail'
export const CONTACT_EMAIL = 'hello@haikumail.app'

/** Set once the Chrome Web Store listing is live. */
export const STORE_URL: string | null = null

export const TAGLINE = 'Gmail, behind a haiku'

export const DESCRIPTION =
  'A Chrome extension that masks your inbox behind a search-only reader. ' +
  'A haiku holds the first thirty seconds. Nothing leaves your browser.'

/** The two the manifest asks for, quoted on the page as evidence. */
export const PERMISSIONS = {
  permissions: ['storage'],
  host_permissions: ['https://mail.google.com/*'],
} as const
