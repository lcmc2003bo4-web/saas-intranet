import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Temporary simple middleware that allows everything.
// Security is currently handled by RLS (Data Layer) and Client-Side Redirects (UI Layer).
// TODO: Implement server-side middleware protection using @supabase/ssr
export async function middleware(req: NextRequest) {
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
