import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // refreshing the auth token
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname

    // 1. If NO user and trying to access protected routes -> redirect to login
    if (
        !user &&
        !pathname.startsWith('/login') &&
        !pathname.startsWith('/auth') &&
        pathname !== '/'
    ) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // 2. If user IS logged in
    if (user) {
        // Redirect from login to dashboard
        if (pathname.startsWith('/login')) {
            // We need to know the role to redirect. Fetching role...
            const { data: profile } = await supabase
                .from('users_profile')
                .select('role')
                .eq('id', user.id)
                .single()

            const role = profile?.role
            const url = request.nextUrl.clone()

            if (['super_admin', 'director', 'admin'].includes(role)) {
                url.pathname = '/admin/dashboard'
            } else if (role === 'teacher') {
                url.pathname = '/teacher/dashboard'
            } else {
                url.pathname = '/student/dashboard'
            }
            return NextResponse.redirect(url)
        }

        // 3. Role-based Route Protection
        // Fetch role if we are in a dashboard route
        if (pathname.startsWith('/admin') || pathname.startsWith('/teacher') || pathname.startsWith('/student')) {
            const { data: profile } = await supabase
                .from('users_profile')
                .select('role')
                .eq('id', user.id)
                .single()

            const role = profile?.role

            if (pathname.startsWith('/admin') && !['super_admin', 'director', 'admin'].includes(role)) {
                return NextResponse.redirect(new URL('/login', request.url))
            }
            if (pathname.startsWith('/teacher') && role !== 'teacher') {
                return NextResponse.redirect(new URL('/login', request.url))
            }
            if (pathname.startsWith('/student') && !['student', 'parent'].includes(role)) {
                return NextResponse.redirect(new URL('/login', request.url))
            }

            // Protect DEV routes (Super Admin only)
            if (pathname.startsWith('/dev') && role !== 'super_admin') {
                return NextResponse.redirect(new URL('/login', request.url))
            }
        }
    }

    // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
    // creating a new response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    // 4. Finally:
    //    return myNewResponse
    // If this is not done, you may be causing the browser and server to go out
    // of sync and terminate the user's session prematurely!

    return supabaseResponse
}
