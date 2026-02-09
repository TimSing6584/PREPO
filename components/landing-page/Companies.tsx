'use client'

import Image from 'next/image'

const companies = [
  { name: 'Google', logo: '/logos/google.svg' },
  { name: 'Meta', logo: '/logos/meta.svg' },
  { name: 'Amazon', logo: '/logos/amazon.svg' },
  { name: 'Microsoft', logo: '/logos/microsoft.svg' },
  { name: 'Apple', logo: '/logos/apple.svg' },
  { name: 'Netflix', logo: '/logos/netflix.svg' },
  { name: 'Bytedance', logo: '/logos/bytedance.svg' },
  { name: 'NVIDIA', logo: '/logos/nvidia.svg' },
  { name: 'Grab', logo: '/logos/grab.svg' },
]


export default function Companies() {
  return (
    <section className="py-24 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-12">
          We are here to help you ace interviews at these companies
        </p>

        {/* Scrolling logos container */}
        <div className="relative overflow-hidden w-full">
          <div className="flex gap-6 animate-slide-left w-max">
            {/* First set */}
            {companies.map((company, index) => (
              <div
                key={`first-${index}`}
              >
                <div
                  key={`first-${index}`}
                  className="flex-shrink-0 hover:bg-white/80 px-10 py-6 rounded-3xl transition-all hover:shadow-md hover:-translate-y-1 group flex items-center justify-center"
                >
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={120}
                    height={48}
                    className="h-10 w-auto opacity-60 group-hover:opacity-100 transition-opacity group-hover:grayscale-0"
                  />
                </div>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {companies.map((company, index) => (
              <div
                key={`second-${index}`}
              >
                 <div
                  key={`second-${index}`}
                  className="flex-shrink-0 hover:bg-white/80 px-10 py-6 rounded-3xl transition-all hover:shadow-md hover:-translate-y-1 group flex items-center justify-center"
                >
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={120}
                    height={48}
                    className="h-10 w-auto opacity-60 group-hover:opacity-100 transition-opacity group-hover:grayscale-0"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Gradient overlays - adjusted for the creamy background */}
          <div className="absolute top-0 left-0 bottom-0 w-48 bg-gradient-to-r from-card-bg to-transparent pointer-events-none z-10"></div>
          <div className="absolute top-0 right-0 bottom-0 w-48 bg-gradient-to-l from-card-bg to-transparent pointer-events-none z-10"></div>
        </div>
      </div>
    </section>
  )
}