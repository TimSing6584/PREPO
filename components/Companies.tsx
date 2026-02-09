'use client'

const companies = [
  'Google', 'Meta', 'Amazon', 'Microsoft', 'Apple',
  'Netflix', 'Tesla', 'Uber', 'Airbnb', 'Spotify',
  'Twitter', 'LinkedIn', 'Salesforce', 'Adobe', 'Oracle'
]

export default function Companies() {
  return (
    <section className="py-24 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-12">
          Trusted by engineers from top-tier companies
        </p>

        {/* Scrolling logos container */}
        <div className="relative overflow-hidden w-full">
          <div className="flex gap-6 animate-slide-left w-max">
            {/* First set */}
            {companies.map((company, index) => (
              <div
                key={`first-${index}`}
                className="flex-shrink-0 bg-white hover:bg-white/80 px-10 py-6 rounded-3xl transition-all border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 group"
              >
                <span className="text-2xl font-bold text-gray-300 group-hover:text-primary-500 transition-colors whitespace-nowrap">
                  {company}
                </span>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {companies.map((company, index) => (
              <div
                key={`second-${index}`}
                className="flex-shrink-0 bg-white hover:bg-white/80 px-10 py-6 rounded-3xl transition-all border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 group"
              >
                <span className="text-2xl font-bold text-gray-300 group-hover:text-primary-500 transition-colors whitespace-nowrap">
                  {company}
                </span>
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