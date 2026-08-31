import { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Projects from './components/Projects.jsx'
import Strengths from './components/Strengths.jsx'
import Contact from './components/Contact.jsx'
import Grainient from './components/Grainient.jsx'
import { initPremiumMotion } from './animations/premiumMotion.js'

export default function App() {
  useEffect(() => {
    const ctx = initPremiumMotion()
    return () => ctx.revert()
  }, [])

  return (
    <div className="site">
      <div className="grain" aria-hidden="true" />
      <Grainient
        className="site-grainient"
        color1="#5a1630"
        color2="#8c1d24"
        color3="#0b0b10"
        timeSpeed={0.8}
        blendSoftness={0.3}
        warpStrength={1.2}
        warpFrequency={6}
        warpSpeed={3}
        rotationAmount={700}
        noiseScale={2}
        grainAmount={0.12}
        grainScale={1.6}
        contrast={1.6}
        saturation={1.05}
        zoom={0.8}
      />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Strengths />
        <Contact />
      </main>
    </div>
  )
}
