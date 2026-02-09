'use client'

import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Preview from '@/components/Preview'
import Companies from '@/components/Companies'
import About from '@/components/About'
import Footer from '@/components/Footer'

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