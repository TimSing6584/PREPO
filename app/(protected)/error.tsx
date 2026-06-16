'use client'

export default function ProtectedError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const isRateLimit = error.digest === 'RATE_LIMIT_EXCEEDED'

    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-center">
            <h1 className="text-xl font-bold text-neutral-900">
                {isRateLimit ? 'Slow down a bit' : 'Something went wrong'}
            </h1>
            <p className="max-w-md text-sm text-neutral-500">
                {isRateLimit
                    ? "You're making too many requests. Please wait a moment and try again."
                    : 'An unexpected error occurred. Please try again.'}
            </p>
            <button
                onClick={reset}
                className="mt-2 rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
                Try again
            </button>
        </div>
    )
}
