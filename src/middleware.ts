// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

const adminRoutes = ['/admin'];
const protectedRoutes = ['/profile', '/orders/new']; 
const authRoutes = ['/login', '/register'];

// Маршруты админки, закрытые от макетчицы (maker)
const managerOnlyAdminRoutes = ['/admin/users', '/admin/content', '/admin/portfolio'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((r) => path.startsWith(r));
  const isAdminRoute = adminRoutes.some((r) => path.startsWith(r));
  const isAuthRoute = authRoutes.some((r) => path.startsWith(r));

  const cookie = request.cookies.get('session')?.value;
  const session = await decrypt(cookie);

  // 1. Попытка входа в админку
  if (isAdminRoute) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.nextUrl));
    }
    
    // Клиентов отправляем в личный кабинет
    if (session.role === 'client') {
      return NextResponse.redirect(new URL('/profile', request.nextUrl));
    }

    // Макетчицу не пускаем в управление пользователями, контентом и портфолио
    if (session.role === 'maker' && managerOnlyAdminRoutes.some((r) => path.startsWith(r))) {
      return NextResponse.redirect(new URL('/admin/orders', request.nextUrl));
    }
  }

  // 2. Доступ к защищенным клиентским роутам
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // 3. Авторизованный пользователь на страницах login/register
  if (isAuthRoute && session) {
    if (session.role === 'client') {
      return NextResponse.redirect(new URL('/profile', request.nextUrl));
    }
    return NextResponse.redirect(new URL('/admin/orders', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};