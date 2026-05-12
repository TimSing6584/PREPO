import Navbar from '@/components/main/Navbar'

export default function Loading() {
  return (
    <div className="main-frame px-6 md:px-12 pb-6 md:pb-12 pt-4 md:pt-6 relative overflow-hidden flex flex-col gap-4 md:gap-6 font-geist-sans">
      <Navbar />

      <div className="flex-1 -mx-6 md:-mx-12 -mb-6 md:-mb-12">
        <div className="h-full overflow-y-auto p-4 md:p-6 bg-neutral-50/30">
          <div className="max-w-4xl mx-auto pb-20">
            <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm p-6 md:p-10">
              <div className="rounded-2xl border border-primary-100 bg-primary-50/60 px-5 py-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full border-2 border-primary-300 border-t-primary-600 animate-spin" />
                  <p className="text-sm md:text-base font-semibold text-primary-800">
                    Questions Data is loading soon
                  </p>
                </div>
              </div>

              <div className="space-y-3 animate-pulse">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-full rounded-2xl border border-neutral-100 bg-neutral-50/60 px-4 py-4 min-h-[72px]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-neutral-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-2/3 rounded-full bg-neutral-200" />
                        <div className="h-3 w-1/3 rounded-full bg-neutral-100" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
