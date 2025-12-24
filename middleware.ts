import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const pathname = req.nextUrl.pathname;
        const role = token?.role as string | undefined;

        // Auditor Portal Protection
        if (pathname.startsWith("/auditor")) {
            if (role !== "auditor" && role !== "admin") {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
        }

        // Dashboard Protection (Auditors shouldn't see full dashboard edit controls)
        if (pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/settings")) {
            // Optional: Redirect auditors to their portal if they try to access main dashboard
            if (role === "auditor") {
                return NextResponse.redirect(new URL("/auditor", req.url));
            }
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const pathname = req.nextUrl.pathname;

                // Explicitly public routes
                const publicRoutes = [
                    "/", "/login", "/register", "/demo", "/trust-center", "/api/auth"
                ];

                // Allow public assets and API
                if (pathname.startsWith("/_next") || pathname.startsWith("/images") || pathname.startsWith("/favicon.ico")) {
                    return true;
                }

                if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + "/"))) {
                    return true;
                }

                // Require token for everything else
                return !!token;
            },
        },
    }
);

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!_next/static|_next/image|favicon.ico|public).*)",
    ],
};
