import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextResponse, NextRequest } from "next/server";
import type { KindeAccessToken } from "@kinde-oss/kinde-auth-nextjs/types";

export default withAuth(
    async function proxy(req: NextRequest) {

        // Allow CORS preflight and other non-navigation requests to pass through.
        if (req.method === "OPTIONS" || req.method === "HEAD") {
            return NextResponse.next();
        }

        return NextResponse.next();
    },
    {
        // Middleware still runs on all routes, but doesn't protect the home route
        publicPaths: ["/", "/bye", "/api/auth/:path*"], // e.g. ["/api/public", "/blog", "/about"],
        isAuthorized: ({ token , req  }: { token: KindeAccessToken; req: NextRequest }) => {
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