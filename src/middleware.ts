import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
})

export const config = {
  matcher: ['/', '/(fr|en)/:path*'],
}
