
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from './app/lib/auth'
import { jwtDecode } from "jwt-decode";

// This function can be marked `async` if using `await` inside

type JwtPayload = {
  id: string,
  username: string,
  role: string
}
const admin = ['/admin/:path*',]
const cashier = ['/cashier/:path*',]
export async function proxy(request: NextRequest) {
  const token = await getToken()

  if (!token && request.nextUrl.pathname === "/login") {
    return NextResponse.next()
  }
  else if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (token) {
    const strtoken = String(token)
    const decoded = jwtDecode<JwtPayload>(strtoken);
    const pathname = request.nextUrl.pathname;
    if (pathname === "/login") {
      return NextResponse.redirect(new URL(decoded.role, request.url))
    }

    // ADMIN PROTED ROUTES
    if (pathname.startsWith('/admin')) {
      if (decoded.role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    // CASHIER PROTECTED ROUTES
    if (pathname.startsWith('/cashier')) {
      if (decoded.role !== "cashier") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }
    if(pathname === '/dashboard' && decoded.role === 'admin'){
       return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }
  return NextResponse.next()
}


export const config = {
  matcher: ['/about/:path*', '/test', '/login','/logout', '/admin/:path*', '/cashier/:path*', '/dashboard','/']
}