'use client'

import Navbar from '@/components/landing-page/Navbar'
import Hero from '@/components/landing-page/Hero'
import Preview from '@/components/landing-page/Preview'
import Companies from '@/components/landing-page/Companies'
import About from '@/components/landing-page/About'
import Footer from '@/components/landing-page/Footer'

export default function Home() {
  return (
    <div className="main-frame">
      <Navbar />
      <main>
        <Hero />
        <Preview />
        <Companies />
        <About />
      </main>
      <Footer />
    </div>
  )
}