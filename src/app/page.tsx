'use client'

import Home from '@/components/Home'
import ImpactStats from '@/components/ImpactStats'
import About from '@/components/About'
import ValueProps from '@/components/ValueProps'
import Skills from '@/components/Skills'
import Projects from '@/components/Projects'
import Contact from '@/components/Contact'

export default function HomePage() {
  return (
    <>
      <Home />
      <ImpactStats />
      <About />
      <ValueProps />
      <Skills />
      <Projects />
      <Contact />
    </>
  )
}
