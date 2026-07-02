import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  '/seller(.*)',
  '/user(.*)',
])

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/forgot-password(.*)',
  '/auth/callback',
  '/auth/choose-role',
  '/auth/sign-out',
])

const roleDashboardMap: Record<string, string> = {
  ADMIN: '/admin/overview',
  SELLER: '/seller/overview',
  CUSTOMER: '/user/overview',
}

const routePrefixToRole: Record<string, string> = {
  admin: 'ADMIN',
  seller: 'SELLER',
  user: 'CUSTOMER',
}

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return
  if (isProtectedRoute(req)) {
    await auth.protect()

    const pathname = req.nextUrl.pathname
    const prefix = pathname.split('/')[1]
    const expectedRole = routePrefixToRole[prefix]
    if (!expectedRole) return

    const { userId } = await auth()
    if (!userId) return

    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const actualRole = (user.unsafeMetadata?.role as string) || 'CUSTOMER'

    if (actualRole !== expectedRole) {
      const destination = roleDashboardMap[actualRole] || '/user/overview'
      return Response.redirect(new URL(destination, req.url))
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
