import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextResponse, NextRequest } from "next/server";
import type { KindeAccessToken } from "@kinde-oss/kinde-auth-nextjs/types";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(60, '1 m'),
    prefix: 'rl:proxy',
    analytics: true,
})

export default withAuth(
    async function proxy(req: NextRequest) {

        // Allow CORS preflight and other non-navigation requests to pass through.
        if (req.method === "OPTIONS" || req.method === "HEAD") {
            return NextResponse.next();
        }

        const ip =
            req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
            req.headers.get('x-real-ip') ??
            'unknown'

        const { success, limit, remaining, reset } = await ratelimit.limit(ip)

        if (!success) {
            return new NextResponse('Too many requests. Please slow down.', {
                status: 429,
                headers: {
                    'X-RateLimit-Limit': String(limit),
                    'X-RateLimit-Remaining': String(remaining),
                    'X-RateLimit-Reset': String(reset),
                    'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
                },
            })
        }

        return NextResponse.next();
    },
    {
        // Middleware still runs on all routes, but doesn't protect the home route
        publicPaths: ["/", "/bye", "/api/auth/:path*"], // e.g. ["/api/public", "/blog", "/about"],
        isAuthorized: ({ token, req }: { token: KindeAccessToken; req: NextRequest }) => {
            if (req.nextUrl.pathname.startsWith("/admin")) {
                const roles = token?.roles as { key: string }[] | undefined;
                return roles?.some(r => r.key === "admin") ?? false;
            }
            return true;
        }
    }
);

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    ],
}