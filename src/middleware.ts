// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

// Роуты, куда пускаем только персонал
const adminRoutes = ['/admin'];
// Роуты, куда пускаем только авторизованных юзеров (любых)
const protectedRoutes = ['/profile', '/orders/new']; 
// Роуты для неавторизованных
const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(r => path.startsWith(r));
  const isAdminRoute = adminRoutes.some(r => path.startsWith(r));
  const isAuthRoute = authRoutes.some(r => path.startsWith(r));

  // Достаем токен из куки
  const cookie = request.cookies.get('session')?.value;
  const session = await decrypt(cookie);

  // 1. Пытается зайти в админку
  if (isAdminRoute) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.nextUrl));
    }
    // Если клиент — шлем лесом на главную
    if (session.role === 'client') {
      return NextResponse.redirect(new URL('/', request.nextUrl));
    }
  }

  // 2. Пытается зайти в профиль без логина
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // 3. Залогиненный юзер лезет на страницу логина
  if (isAuthRoute && session) {
    // Админов кидаем в админку, клиентов — в профиль
    if (session.role !== 'client') {
      return NextResponse.redirect(new URL('/admin', request.nextUrl));
    }
    return NextResponse.redirect(new URL('/profile', request.nextUrl));
  }

  return NextResponse.next();
}

// Указываем Next.js, для каких путей гонять этот middleware 
// (исключаем статику, картинки и апишки, чтобы не грузить сервак)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};