'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * The hero demo: a recording of the extension doing the thing the headline
 * claims, because a sentence about hiding an inbox is harder to picture than
 * twelve seconds of watching it happen.
 *
 * Autoplay is muted, looping and inline — the three conditions every browser
 * requires before it will start a video by itself. Under `prefers-reduced-
 * motion` it does not start at all: the poster stands in until asked, which is
 * the honest reading of a request not to be moved at.
 */
export function HeroVideo() {
  const video = useRef<HTMLVideoElement>(null)
  const [still, setStill] = useState(false)

  useEffect(() => {
    const quiet = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!quiet.matches) return
    setStill(true)
    video.current?.pause()
  }, [])

  return (
    <figure className="hk-demo">
      <video
        ref={video}
        className="hk-demo-video"
        poster="/video/haikumail-poster.jpg"
        autoPlay={!still}
        muted
        loop
        playsInline
        preload="metadata"
        controls={still}
        aria-label="HaikuMail replacing the Gmail inbox: a haiku appears with a thirty second counter, then a search box, a result, and the message opened as plain text."
      >
        <source src="/video/haikumail.webm" type="video/webm" />
        <source src="/video/haikumail.mp4" type="video/mp4" />
      </video>
      <figcaption>
        The real thing, in the time it takes to read this: the inbox is gone, a poem
        holds thirty seconds, and then you ask for the one message you came for.
      </figcaption>
    </figure>
  )
}
