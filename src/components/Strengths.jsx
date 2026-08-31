import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import { site } from '../data/site.js'

export default function Strengths() {
  return (
    <section className="strengths section" id="strengths">
      <div className="container">
        <Reveal className="section__head">
          <p className="eyebrow">STRENGTHS / 优势</p>
          <h2 className="section__title">个人优势</h2>
          <p className="section__lead">
            十余年跨领域设计实践，覆盖空间、品牌、IP、AI 与产品，具备从创意到落地的综合能力。
          </p>
        </Reveal>

        <div className="strengths__grid">
          {site.strengths.map((item, i) => (
            <Reveal className="strength-card" delay={(i % 3) * 80} key={item.title}>
              <div className="strength-card__icon">
                <Icon name={item.icon} size={26} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
