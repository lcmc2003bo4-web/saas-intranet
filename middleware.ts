import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ROLE_PATHS = {
    "STUDENT": "/student",
    "TEACHER": "/teacher",
    "ADMIN": "/admin",
    "DEV": "/dev"
} as const

type Role = keyof typeof ROLE_PATHS

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname
    const token = await getToken({ req })

    // 1. Check for Public Paths (Login, Assets)
    if (path.startsWith("/login") || path.startsWith("/static") || path.startsWith("/api/auth")) {
        if (token) {
            const role = token.role as Role
            if (ROLE_PATHS[role]) {
                return NextResponse.redirect(new URL(ROLE_PATHS[role] + "/dashboard", req.url))
            }
        }
        return NextResponse.next()
    }

    // 2. Authentication Check
    if (!token) {
        const url = new URL("/login", req.url)
        url.searchParams.set("callbackUrl", path)
        return NextResponse.redirect(url)
    }

    // 3. Role-Based Access Control (RBAC)
    const userRole = token.role as Role
    const allowedPath = ROLE_PATHS[userRole]

    if (!allowedPath) {
        // Invalid role or no path defined
        return NextResponse.redirect(new URL("/login", req.url))
    }

    // If user tries to access a path that doesn't start with their allowed path
    if (!path.startsWith(allowedPath)) {
        // Redirect back to their own safe dashboard
        return NextResponse.redirect(new URL(allowedPath + "/dashboard", req.url))
    }

    // 4. Authorized -> Allow access
    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
