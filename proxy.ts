import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
export default withAuth(
    async function proxy() {

    },
    {
        // Middleware still runs on all routes, but doesn't protect the home route
        publicPaths: ["/"], // e.g. ["/api/public", "/blog", "/about"]
    }
);

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    ],
}