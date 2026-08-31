import { useEffect, useState } from 'react'
import { site } from '../data/site.js'
import logo from '../assets/logo.png'

const links = [
  { href: '#about', label: '关于' },
  { href: '#projects', label: '案例' },
  { href: '#strengths', label: '优势' }
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="container nav__inner">
        <a href="#top" className="nav__brand">
          <img className="nav__brand-mark" src={logo} alt="Mr. Ying" />
          <span className="nav__brand-text">
            <span className="nav__brand-name">Mr. Ying</span>
            <span className="nav__brand-sub">YING · DESIGN</span>
          </span>
        </a>
        <nav className="nav__links" aria-label="主导航">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="nav__status" title="当前可接项目">
          <span className="nav__status-dot" />
          可接项目
        </div>
        <a href="#contact" className="btn btn--small">
          联系我
        </a>
      </div>
    </header>
  )
}
