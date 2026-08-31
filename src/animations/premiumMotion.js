import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Premium, agency-style scroll motion. Keeps everything on transform / clip-path / opacity
// for smooth, GPU-friendly movement. No cheap bounces; slow, silky easing.
export function initPremiumMotion() {
  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 900px)', () => {
      // 1) Section headings: dramatic entrance (clip reveal + movement + fade)
      gsap.utils.toArray('.section__head').forEach((head) => {
        const title = head.querySelector('.section__title')
        const eyebrow = head.querySelector('.eyebrow')
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: head,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        })
        if (eyebrow) {
          tl.from(eyebrow, { y: 30, autoAlpha: 0, duration: 0.7, ease: 'power3.out' })
        }
        if (title) {
          tl.from(
            title,
            { y: 90, autoAlpha: 0, clipPath: 'inset(0 0 100% 0)', duration: 1.3, ease: 'expo.out' },
            '-=0.5'
          )
        }
      })

      // Contact heading
      const contactTitle = document.querySelector('.contact__title')
      if (contactTitle) {
        gsap.from(contactTitle, {
          y: 90,
          autoAlpha: 0,
          clipPath: 'inset(0 0 100% 0)',
          duration: 1.3,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.contact',
            start: 'top 72%',
            toggleActions: 'play none none reverse'
          }
        })
      }

      // 2) Staggered card / item groups per module
      const groups = [
        { trigger: '#about .stats', items: '.stat' },
        { trigger: '#about', items: '#about .about__intro-card, #about .about__avatar-art, #about .about__contact' },
        { trigger: '#about .timeline__list', items: '.timeline__item' },
        { trigger: '#projects', items: '.project-card' },
        { trigger: '#strengths', items: '.strength-card' }
      ]
      groups.forEach(({ trigger, items }) => {
        const els = gsap.utils.toArray(items)
        if (!els.length) return
        const anchor = document.querySelector(trigger) || els[0]
        gsap.from(els, {
          y: 70,
          autoAlpha: 0,
          scale: 0.98,
          duration: 1.05,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: anchor,
            start: 'top 78%',
            toggleActions: 'play none none reverse'
          }
        })
      })

      // 3) Image reveal (avatar + project art)
      gsap.utils.toArray('.about__avatar-img, .project-card__media-art').forEach((el) => {
        gsap.from(el, {
          scale: 1.14,
          autoAlpha: 0,
          duration: 1.3,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 84%',
            toggleActions: 'play none none reverse'
          }
        })
      })

    })
  })

  return ctx
}
