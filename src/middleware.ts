// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session-token';

const adminRoutes = ['/admin', '/content/articles'];
const protectedRoutes = ['/profile', '/orders/new']; 
const authRoutes = ['/login', '/register'];

// Маршруты админки, закрытые от макетчицы (maker)
const managerOnlyAdminRoutes = ['/admin/users', '/admin/content', '/admin/portfolio', '/content/articles'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path.startsWith('/uploads/proofs/')) return new NextResponse(null, { status: 404 });
  const isProtectedRoute = protectedRoutes.some((r) => path.startsWith(r));
  const isAdminRoute = adminRoutes.some((r) => path.startsWith(r));
  const isAuthRoute = authRoutes.some((r) => path.startsWith(r));

  const cookie = request.cookies.get('session')?.value;
  const session = await decrypt(cookie);

  // Формируем честный базовый URL для внешних редиректов
  const baseUrl = process.env.APP_URL || request.nextUrl.origin;

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
