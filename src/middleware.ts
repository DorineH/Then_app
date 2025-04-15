// // src/middleware.ts
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// const PUBLIC_FILE = /\.(.*)$/;

// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   if (
//     pathname.startsWith('/_next') ||
//     pathname.startsWith('/api') ||
//     PUBLIC_FILE.test(pathname)
//   ) {
//     return;
//   }

//   const locale = req.nextUrl.locale || 'fr';

//   if (!pathname.startsWith(`/${locale}`)) {
//     return NextResponse.redirect(new URL(`/${locale}${pathname}`, req.url));
//   }
// }

// export const config = {
//   matcher: ['/((?!_next|api|.*\\..*).*)'],
// };

export const config = {
  matcher: ['/((?!_next|.*\\..*|favicon.ico).*)'], // Exclut les fichiers statiques
}
