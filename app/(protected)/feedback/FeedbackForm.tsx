'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronDown, Paperclip, X } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = ['General', 'Bug Report', 'Feature Request', 'Content Feedback'] as const
type Category = (typeof CATEGORIES)[number] | ''

type FormErrors = {
  category?: string
  message?: string
}

const MAX_IMAGE_SIZE = 4 * 1024 * 1024 // 4 MB per file
const MAX_IMAGE_COUNT = 5

export default function FeedbackForm() {
  const router = useRouter()
  const [category, setCategory] = useState<Category>('')
  const [message, setMessage] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files ?? [])
    e.target.value = ''

    const remaining = MAX_IMAGE_COUNT - images.length
    if (remaining <= 0) {
      toast.error(`Max ${MAX_IMAGE_COUNT} images allowed.`)
      return
    }

    const toAdd = incoming.slice(0, remaining)
    const oversized = toAdd.filter(f => f.size > MAX_IMAGE_SIZE)
    if (oversized.length > 0) {
      toast.error(`Each image must be under 4 MB. ${oversized.length} file(s) skipped.`)
    }

    const valid = toAdd.filter(f => f.size <= MAX_IMAGE_SIZE)
    if (valid.length === 0) return

    setImages(prev => [...prev, ...valid])
    setPreviews(prev => [...prev, ...valid.map(f => URL.createObjectURL(f))])
  }

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index])
    setImages(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const validate = (): boolean => {
    const next: FormErrors = {}
    if (!category) next.category = 'Please select a category.'
    if (!message.trim()) next.message = 'Message is required.'
    setErrors(next)
    if (Object.keys(next).length > 0) toast.error('Please fill in all required fields.')
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting || !validate()) return
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('category', category)
      formData.append('message', message.trim())
      images.forEach(img => formData.append('images', img))

      const res = await fetch('/api/feedback', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(json.error ?? 'Failed to send feedback.')
      }
      toast.success('Feedback sent! Thank you.')
      setMessage('')
      setCategory('')
      previews.forEach(p => URL.revokeObjectURL(p))
      setImages([])
      setPreviews([])
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="px-1 sm:px-2">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-neutral-900 transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back
        </button>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-[2rem] border border-neutral-100 shadow-sm p-4 sm:p-6 md:p-10">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#101010] mb-1">Send Feedback</h1>
        <p className="text-xs sm:text-sm text-neutral-500 mb-6">Let us know what you think.</p>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value as Category); if (errors.category) setErrors(p => ({ ...p, category: undefined })) }}
                disabled={isSubmitting}
                className={`w-full appearance-none pl-4 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent ${errors.category ? 'border-red-400' : 'border-gray-300'}`}
              >
                <option value="">Select a category...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => { setMessage(e.target.value); if (errors.message) setErrors(p => ({ ...p, message: undefined })) }}
              disabled={isSubmitting}
              rows={5}
              placeholder="Tell us what's on your mind..."
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none ${errors.message ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Attachments <span className="text-neutral-400 text-xs">(optional · max 5 images · 4 MB each)</span>
            </label>

            {previews.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`Preview ${i + 1}`} className="h-24 w-24 rounded-lg border border-gray-200 object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 bg-white border border-gray-200 rounded-full p-0.5 shadow hover:bg-red-50 transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {images.length < MAX_IMAGE_COUNT && (
              <label className={`flex items-center gap-2 w-fit cursor-pointer px-4 py-2.5 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-amber-400 hover:text-amber-600 transition-colors ${isSubmitting ? 'pointer-events-none opacity-50' : ''}`}>
                <Paperclip className="w-4 h-4 shrink-0" />
                {images.length === 0 ? 'Attach images' : `Add more (${images.length}/${MAX_IMAGE_COUNT})`}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={isSubmitting}
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${isSubmitting ? 'bg-amber-200 text-amber-400 cursor-not-allowed' : 'bg-amber-400 text-amber-900 hover:bg-amber-500 hover:scale-105'}`}
            >
              {isSubmitting ? 'Sending...' : 'Send Feedback'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
