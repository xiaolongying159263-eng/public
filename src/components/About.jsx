import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import BorderGlow from './BorderGlow.jsx'
import { site } from '../data/site.js'
import aboutPic from '../assets/about-pic.png'

export default function About() {
  return (
    <section className="about section" id="about">
      <div className="container">
        <Reveal className="section__head">
          <p className="eyebrow">ABOUT / 经历</p>
          <h2 className="section__title">关于我</h2>
        </Reveal>

        <div className="about__grid">
          <Reveal className="about__left">
            <div className="about__avatar">
              <BorderGlow className="glow-only" edgeSensitivity={9} glowColor="40 80 80" backgroundColor="#120F17" borderRadius={24} glowRadius={12} glowIntensity={0.3} coneSpread={6} animated={false} colors={['#c084fc', '#f472b6', '#38bdf8']}>
                <div className="about__avatar-art">
                  <img className="about__avatar-img" src={aboutPic} alt="应先生" />
                </div>
              </BorderGlow>
            </div>

            <BorderGlow className="glow-only" edgeSensitivity={9} glowColor="40 80 80" backgroundColor="#120F17" borderRadius={20} glowRadius={12} glowIntensity={0.3} coneSpread={6} animated={false} colors={['#c084fc', '#f472b6', '#38bdf8']}>
              <div className="about__contact card">
                <div className="about__contact-head">
                  <div className="about__contact-name">应小龙</div>
                  <div className="about__contact-role">主创设计师</div>
                </div>
                <ul className="about__contact-list">
                  <li>
                    <Icon name="phone" size={18} />
                    <span>{site.phoneDisplay}</span>
                  </li>
                  <li>
                    <Icon name="location" size={18} />
                    <span>{site.city}</span>
                  </li>
                  {site.email && (
                    <li>
                      <Icon name="mail" size={18} />
                      <span>{site.email}</span>
                    </li>
                  )}
                </ul>
              </div>
            </BorderGlow>
          </Reveal>

          <div className="about__right">
            <BorderGlow className="glow-only" edgeSensitivity={9} glowColor="40 80 80" backgroundColor="#120F17" borderRadius={20} glowRadius={12} glowIntensity={0.3} coneSpread={6} animated={false} colors={['#c084fc', '#f472b6', '#38bdf8']}>
              <Reveal className="about__intro-card">
                <h3 className="about__lead">{site.roleLine}</h3>
                {site.intro.map((paragraph) => (
                  <p className="about__text" key={paragraph}>
                    {paragraph}
                  </p>
                ))}
              </Reveal>
            </BorderGlow>

            <Reveal className="stats">
              {site.stats.map((stat) => (
                <BorderGlow className="glow-only" edgeSensitivity={9} glowColor="40 80 80" backgroundColor="#120F17" borderRadius={16} glowRadius={12} glowIntensity={0.3} coneSpread={6} animated={false} colors={['#c084fc', '#f472b6', '#38bdf8']} key={stat.label}>
                  <div className="stat">
                    <div className="stat__value">
                      {stat.value}
                      <span className={stat.suffix === '大' ? 'stat__suffix--big' : undefined}>
                        {stat.suffix}
                      </span>
                    </div>
                    <div className="stat__label">{stat.label}</div>
                  </div>
                </BorderGlow>
              ))}
            </Reveal>

            <Reveal className="timeline">
              <h3 className="timeline__title">工作经历</h3>
              <div className="timeline__list">
                {site.education.map((item) => (
                  <div className="timeline__item" key={item.school}>
                    <div className="timeline__dot" />
                    <div className="timeline__period">{item.period}</div>
                    <div className="timeline__body">
                      <div className="timeline__role">
                        {item.major} · {item.degree}
                      </div>
                      <div className="timeline__company">{item.school}</div>
                    </div>
                  </div>
                ))}
                {site.experience.map((item) => (
                  <div className="timeline__item" key={item.company}>
                    <div className="timeline__dot" />
                    <div className="timeline__period">{item.period}</div>
                    <div className="timeline__body">
                      <div className="timeline__role">{item.role}</div>
                      <div className="timeline__company">{item.company}</div>
                      <div className="timeline__desc">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
