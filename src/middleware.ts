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

  // Формируем честный базовый URL для внешних редиректов
  const originHeader = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const protoHeader = request.headers.get('x-forwarded-proto') || 'http';
  const baseUrl = process.env.APP_URL || (originHeader ? `${protoHeader}://${originHeader}` : request.nextUrl.origin);

  // 1. Попытка входа в админку
  if (isAdminRoute) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', baseUrl));
    }
    
    // Клиентов отправляем в личный кабинет
    if (session.role === 'client') {
      return NextResponse.redirect(new URL('/profile', baseUrl));
    }

    // Макетчицу не пускаем в управление пользователями, контентом и портфолио
    if (session.role === 'maker' && managerOnlyAdminRoutes.some((r) => path.startsWith(r))) {
      return NextResponse.redirect(new URL('/admin/orders', baseUrl));
    }
  }

  // 2. Доступ к защищенным клиентским роутам
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', baseUrl));
  }

  // 3. Авторизованный пользователь на страницах login/register
  if (isAuthRoute && session) {
    if (session.role === 'client') {
      return NextResponse.redirect(new URL('/profile', baseUrl));
    }
    return NextResponse.redirect(new URL('/admin/orders', baseUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};