import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest } from "next/server";


// Things to note:  We just need to protect the route where the user needs 
// to be authenticated.

// Define routes to be protected
// TODO: Later add routes that need to be protected here.
const protectedRoutes = ["/test"];

export default withAuth(
    async function middleware(req: NextRequest) {
        const {pathname} = req.nextUrl;
        const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
        if (isProtectedRoute) {
            // If the route is protected, ensure the user is authenticated
            // The withAuth middleware will handle the authentication check and redirection if needed
            return;
        }
    }
);

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    ],
}