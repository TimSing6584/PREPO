import Navbar from '@/components/main/Navbar'
import FeedbackForm from './FeedbackForm'

export default function FeedbackPage() {
  return (
    <div className="main-frame px-4 sm:px-6 md:px-12 pb-6 md:pb-12 pt-4 md:pt-6 relative overflow-hidden flex flex-col gap-3 sm:gap-4 md:gap-6 font-geist-sans">
      <Navbar />
      <div className="flex-1 -mx-4 sm:-mx-6 md:-mx-12 -mb-6 md:-mb-12">
        <div className="h-full overflow-y-auto p-3 sm:p-4 md:p-6 bg-neutral-50/30">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-8 pb-16 sm:pb-20">
            <FeedbackForm />
          </div>
        </div>
      </div>
    </div>
  )
}
