import { useState } from 'react'
import Reveal from './Reveal.jsx'
import Icon from './Icon.jsx'
import { site } from '../data/site.js'

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copyPhone = () => {
    const write = navigator.clipboard
      ? navigator.clipboard.writeText(site.phone)
      : Promise.reject()
    write
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1800)
      })
      .catch(() => {
        setCopied(false)
      })
  }

  return (
    <section className="contact" id="contact">
      <div className="contact__bg" aria-hidden="true" />
      <div className="container contact__inner">
        <Reveal>
          <p className="eyebrow">CONTACT / 联系</p>
          <h2 className="contact__title">
            让我们
            <br />
            聊聊你的<span>想法</span>
          </h2>
          <p className="contact__sub">
            如果你正在寻找一个能贯通空间、品牌、IP、AI 与产品的设计伙伴，欢迎随时联系。
          </p>
        </Reveal>

        <Reveal className="contact__actions">
          <a href={`tel:${site.phone}`} className="btn btn--primary btn--lg">
            <Icon name="phone" size={20} />
            拨打电话
          </a>
          <button type="button" className="btn btn--ghost btn--lg" onClick={copyPhone}>
            <Icon name={copied ? 'check' : 'copy'} size={20} />
            {copied ? '已复制号码' : '复制电话'}
          </button>
          {site.email && (
            <a href={`mailto:${site.email}`} className="btn btn--ghost btn--lg">
              <Icon name="mail" size={20} />
              发送邮件
            </a>
          )}
        </Reveal>

        <div className="contact__foot">
          <span>
            © {new Date().getFullYear()} {site.name} · {site.roleLine}
          </span>
          <span>
            {site.city} · {site.phoneDisplay}
          </span>
        </div>
      </div>
    </section>
  )
}
