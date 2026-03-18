import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

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
        publicPaths: ["/", "/bye", "/api/auth/:path*"], // e.g. ["/api/public", "/blog", "/about"]
    }
);

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    ],
}