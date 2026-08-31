import { useEffect, useRef } from 'react'
import { site } from '../data/site.js'

export default function Hero() {
  const videoRef = useRef(null)
  const sectionRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video) return
    const tryPlay = () => video.play().catch(() => {})
    tryPlay()
    const onInteract = () => {
      video.muted = false
      if (video.paused) tryPlay()
    }
    window.addEventListener('pointerdown', onInteract, { once: true })
    window.addEventListener('keydown', onInteract, { once: true })

    let observer
    if (section) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              video.pause()
            } else if (video.paused) {
              tryPlay()
            }
          })
        },
        { threshold: 0.15 }
      )
      observer.observe(section)
    }

    return () => {
      window.removeEventListener('pointerdown', onInteract)
      window.removeEventListener('keydown', onInteract)
      if (observer) observer.disconnect()
    }
  }, [])

  return (
    <section className="hero" id="top" ref={sectionRef}>
      <div className="hero__bg" aria-hidden="true">
        {site.heroVideo && (
          <video
            ref={videoRef}
            className="hero__video"
            src={site.heroVideo}
            autoPlay
            muted
            loop
            playsInline
          />
        )}
        <div className="hero__aurora" />
        <div className="hero__vignette" />
      </div>

      <div className="container hero__meta">
        <span>© 2026 {site.name} · STUDIO</span>
        <span className="hero__meta-cell--center">{site.city}</span>
        <span className="hero__meta-cell--right">
          <span className="hero__meta-dot" />
          Open for projects
        </span>
      </div>

      <a href="#about" className="hero__scroll" aria-label="向下滚动">
        <span>SCROLL</span>
        <span className="hero__scroll-line" />
      </a>
    </section>
  )
}
