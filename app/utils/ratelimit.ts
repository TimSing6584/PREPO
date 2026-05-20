import { Ratelimit } from '@upstash/ratelimit'
import { redis } from './redis'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

// Different limiters for different route sensitivity
export const rateLimiters = {
    // General reads: 60 requests per minute
    read: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(60, '1 m'),
        prefix: 'rl:read',
        analytics: true,
    }),
    // Writes (create/update): 20 requests per minute
    write: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, '1 m'),
        prefix: 'rl:write',
        analytics: true,
    }),
    // Sensitive ops (s3 upload): 10 requests per minute
    upload: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '1 m'),
        prefix: 'rl:upload',
        analytics: true,
    }),
    // Unauthenticated endpoints (IP-based): 30 requests per minute
    ip: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(30, '1 m'),
        prefix: 'rl:ip',
        analytics: true,
    }),
}

type LimiterKey = keyof typeof rateLimiters

/**
 * Checks rate limit for the current authenticated user.
 * Returns a 429 NextResponse if exceeded, otherwise null.
 */
export async function checkRateLimit(
    type: LimiterKey
): Promise<NextResponse | null> {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    // Should not happen since routes already check auth, but guard anyway
    if (!user?.id) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { success, limit, remaining, reset } = await rateLimiters[type].limit(user.id)

    if (!success) {
        return NextResponse.json(
            { error: 'Too many requests. Please slow down.' },
            {
                status: 429,
                headers: {
                    'X-RateLimit-Limit': String(limit),
                    'X-RateLimit-Remaining': String(remaining),
                    'X-RateLimit-Reset': String(reset),
                    'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
                },
            }
        )
    }

    return null
}

/**
 * Checks rate limit by IP for unauthenticated endpoints.
 * Returns a 429 NextResponse if exceeded, otherwise null.
 */
export async function checkIpRateLimit(request: NextRequest): Promise<NextResponse | null> {
    const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        request.headers.get('x-real-ip') ??
        'unknown'

    const { success, limit, remaining, reset } = await rateLimiters.ip.limit(ip)

    if (!success) {
        return NextResponse.json(
            { error: 'Too many requests. Please slow down.' },
            {
                status: 429,
                headers: {
                    'X-RateLimit-Limit': String(limit),
                    'X-RateLimit-Remaining': String(remaining),
                    'X-RateLimit-Reset': String(reset),
                    'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
                },
            }
        )
    }

    return null
}
