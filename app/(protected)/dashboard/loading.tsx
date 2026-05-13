import Navbar from '@/components/main/Navbar'

export default function Loading() {
  return (
    <div className="main-frame px-6 md:px-12 pb-6 md:pb-12 pt-4 md:pt-6 relative overflow-hidden flex flex-col gap-8 md:gap-12 font-geist-sans">
      <Navbar />

      <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-10 z-10">
        <div className="space-y-6">
          <div className="text-center mx-auto space-y-3">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#101010] tracking-tight">
              Welcome back.
            </h1>
            <p className="text-lg md:text-2xl text-neutral-500 font-semibold">What do you want to master?</p>
            <div className="pt-2">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <div className="h-10 w-72 rounded-full border border-primary-200 bg-primary-50 animate-pulse" />
                <div className="h-10 w-64 rounded-full border border-neutral-200 bg-white animate-pulse" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-neutral-100 shadow-sm">
              <div className="space-y-3 animate-pulse">
                <div className="h-8 w-72 rounded-full bg-neutral-200" />
                <div className="h-5 w-64 rounded-full bg-neutral-100" />
                <div className="flex justify-end pt-6">
                  <div className="h-12 w-12 rounded-full bg-primary-100" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-neutral-100 shadow-sm">
              <div className="space-y-3 animate-pulse">
                <div className="h-8 w-48 rounded-full bg-neutral-200" />
                <div className="h-5 w-56 rounded-full bg-neutral-100" />
                <div className="flex justify-end pt-6">
                  <div className="h-12 w-12 rounded-full bg-primary-100" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-xl font-medium text-neutral-400 uppercase tracking-wider pl-2">Topics</h3>
          <div className="rounded-2xl border border-primary-100 bg-primary-50/60 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-full border-2 border-primary-300 border-t-primary-600 animate-spin" />
              <p className="text-sm md:text-base font-semibold text-primary-800">Topics data is loading soon</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto animate-pulse">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden flex flex-col"
              >
                <div className="h-48 w-full bg-neutral-200" />
                <div className="p-6 flex flex-col gap-4 items-center text-center">
                  <div className="h-8 w-48 rounded-full bg-neutral-200" />
                  <div className="h-10 w-32 rounded-full bg-neutral-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary-200/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div
        className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-primary-100/30 rounded-full blur-3xl animate-float pointer-events-none"
        style={{ animationDelay: '2s' }}
      />
    </div>
  )
}
