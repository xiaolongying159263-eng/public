import Reveal from './Reveal.jsx'
import Marquee from './Marquee.jsx'
import VideoScrubber from './VideoScrubber.jsx'
import { site } from '../data/site.js'

const COMMERCIAL_IMAGES = [
  '/commercial-1.webp',
  '/commercial-2.webp',
  '/commercial-3.webp',
  '/commercial-4.webp',
]

const PRODUCT_IMAGES = [
  '/product-1.webp',
  '/product-2.webp',
]

function scrollToContact() {
  const el = document.getElementById('contact')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Projects() {
  return (
    <section className="projects section" id="projects">
      <div className="container">
        <Reveal className="section__head section__head--between">
          <div>
            <p className="eyebrow">SELECTED / 项目</p>
            <h2 className="section__title">个别案例</h2>
          </div>
        </Reveal>

        <div className="projects__grid">
          {site.projects.map((project, i) => (
            <Reveal className="project-card" delay={(i % 2) * 90} key={project.index}>
              <div
                role="button"
                tabIndex={0}
                className="project-card__inner"
                style={{ '--hue': project.hue }}
                onClick={scrollToContact}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    scrollToContact()
                  }
                }}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
              >
                <div className="project-card__media">
                  {project.index === '05' ? (
                    <Marquee speed={72}>
                      {PRODUCT_IMAGES.map((src, k) => (
                        <img key={k} src={src} alt={k === 0 ? project.title : ''} aria-hidden={k !== 0 ? 'true' : undefined} />
                      ))}
                      {PRODUCT_IMAGES.map((src, k) => (
                        <img key={k + '-dup'} src={src} alt="" aria-hidden="true" />
                      ))}
                    </Marquee>
                  ) : project.index === '03' ? (
                    <Marquee speed={70}>
                      <img src="/brand-sheet.webp" alt={project.title} />
                      <img src="/brand-sheet.webp" alt="" aria-hidden="true" />
                    </Marquee>
                  ) : project.index === '01' ? (
                    <Marquee speed={68}>
                      {COMMERCIAL_IMAGES.map((src, k) => (
                        <img key={k} src={src} alt={k === 0 ? project.title : ''} aria-hidden={k !== 0 ? 'true' : undefined} />
                      ))}
                      {COMMERCIAL_IMAGES.map((src, k) => (
                        <img key={k + '-dup'} src={src} alt="" aria-hidden="true" />
                      ))}
                    </Marquee>
                  ) : project.index === '02' ? (
                    <Marquee speed={68}>
                      <img src="/interior-1.webp" alt={project.title} />
                      <img src="/interior-1.webp" alt="" aria-hidden="true" />
                    </Marquee>
                  ) : project.index === '04' ? (
                    <Marquee speed={68}>
                      <img src="/ip-1.webp" alt={project.title} />
                      <img src="/ip-1.webp" alt="" aria-hidden="true" />
                    </Marquee>
                  ) : project.index === '06' ? (
                    <VideoScrubber src="/animation.mp4" />
                  ) : (
                    <div className="project-card__media-art" />
                  )}
                  <span className="project-card__index">{project.index}</span>
                  <span className="project-card__category">{project.category}</span>
                </div>
                <div className="project-card__body">
                  <div className="project-card__heading">
                    <h3>{project.title}</h3>
                    <span className="project-card__arrow">↗</span>
                  </div>
                  <p>{project.desc}</p>
                  <ul className="project-card__tags">
                    {project.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
