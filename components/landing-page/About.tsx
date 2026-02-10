'use client'

import { User as UserIcon, Linkedin, Github, Mail } from 'lucide-react'
import Image from 'next/image'

const founders = [
  {
    name: 'Claude Pham',
    image: '/avatar/claude-pham.jpeg',
    education: 'Computer Science, NTU',
    bio: 'Meta? Google? Gotta Catch \'Em All!',
    linkedin: 'https://www.linkedin.com/in/pham-tran-minh-tuan/',
    github: 'https://github.com/minhtuan-ne',
    email: 'phamtranminhtuan2006@gmail.com'
  },
  {
    name: 'Andrich Hoang',
    image: '/avatar/andrich-hoang.jpeg',
    education: 'Computer Science, NTU',
    bio: 'Most problems aren’t hard - the fundamentals are just weak',
    linkedin: 'https://www.linkedin.com/in/thinhhoang268/',
    github: 'https://github.com/TimSing6584',
    email: 'andrich916@gmail.com'
  }
]

export default function About() {
  return (
    <section id="about" className="py-24 px-12 bg-[#101010] rounded-[3.5rem] my-12 mx-6 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-900/10 blur-[120px] rounded-full"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6">
            Meet the <span className="text-primary-400 italic">Visionaries</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            We are Computer Science students at NTU who understand the challenges of technical interviews firsthand. 
            Our mission is to make interview preparation accessible, effective, and less stressful for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {founders.map((founder, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 transition-all hover:bg-white/10 hover:-translate-y-2 group"
            >
              {/* Avatar */}
              <div className="flex justify-center mb-8">
                <Image 
                  src={founder.image} 
                  alt={founder.name} 
                  width={128}
                  height={128}
                  className="rounded-[2rem] rotate-3 group-hover:rotate-0 transition-transform"
                />
              </div>
              {/* Info */}
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-2">{founder.name}</h3>
                <p className="text-gray-500 text-sm mb-6">{founder.education}</p>
                <p className="text-gray-400 leading-relaxed italic">"{founder.bio}"</p>
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-4 pt-8 border-t border-white/10">
                <a
                  href={founder.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 hover:bg-primary-500 rounded-2xl transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-6 h-6 text-white" />
                </a>
                <a
                  href={founder.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 hover:bg-primary-500 rounded-2xl transition-all"
                  aria-label="GitHub"
                >
                  <Github className="w-6 h-6 text-white" />
                </a>
                <a
                  href={`mailto:${founder.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 hover:bg-primary-500 rounded-2xl transition-all"
                  aria-label="Email"
                >
                  <Mail className="w-6 h-6 text-white" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}