import { StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import themeCss from '@radix-ui/themes/styles.css?inline'
import appCss from './app.css?inline'
import App from '../app/App'
import { FAVICON_SVG } from '../app/Logo'
import { maskTabIdentity } from '../lib/gmail'
import { hideRestoreButton, showRestoreButton } from './restore'

const HOST_ID = 'haikumail-root'
const MASKED_TITLE = 'HaikuMail'

/**
 * Mount point: appended to <html>, not <body>. `mask.css` hides <body>, so
 * living outside it is what keeps our UI visible while Gmail is not.
 */
function mount(): { host: HTMLElement; root: Root } {
  const host = document.createElement('div')
  host.id = HOST_ID
  const shadow = host.attachShadow({ mode: 'open' })

  const style = document.createElement('style')
  // Radix Themes scopes some tokens to :root, which never matches inside a
  // shadow tree — rehome them onto the host.
  style.textContent = themeCss.replace(/:root\b/g, ':host') + '\n' + appCss
  shadow.append(style)

  const container = document.createElement('div')
  shadow.append(container)
  document.documentElement.append(host)

  const root = createRoot(container)
  return { host, root }
}

let unmasked = false

/**
 * The stylesheet that undoes the mask. Kept as a handle rather than dropped and
 * forgotten, because putting the mask back on is just removing it again.
 */
let undoStyle: HTMLStyleElement | null = null

function unmask(root: Root, host: HTMLElement) {
  unmasked = true
  root.unmount()
  host.remove()

  undoStyle = document.createElement('style')
  undoStyle.textContent = 'body { visibility: visible !important } html { overflow: auto !important }'
  document.documentElement.append(undoStyle)

  // Without this the tab becomes plain Gmail with no way back short of a
  // reload — and a reload is a big enough price to make unmasking feel final.
  showRestoreButton(remask)
}

function remask() {
  hideRestoreButton()
  undoStyle?.remove()
  undoStyle = null
  unmasked = false
  start()
}

function start() {
  if (unmasked || document.getElementById(HOST_ID)) return
  // The tab keeps HaikuMail's title and icon even while unmasked: whatever you
  // are doing in Gmail, the tab should not go back to being a notification.
  maskTabIdentity(MASKED_TITLE, FAVICON_SVG)

  const { host, root } = mount()

  root.render(
    <StrictMode>
      <App onUnmask={() => unmask(root, host)} />
    </StrictMode>,
  )
}

start()

// Gmail replaces large parts of the document as it boots; make sure the mask
// survives that.
new MutationObserver(() => {
  if (!document.getElementById(HOST_ID)) start()
}).observe(document.documentElement, { childList: true })
