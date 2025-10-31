import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { validateRedirectUri } from "@/lib/auth/validate-redirect";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const cookieDomain = process.env.NODE_ENV === 'production' ? '.volvix.com.br' : undefined;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          const cookieOptions = {
            ...options,
            domain: cookieDomain,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
          };
          
          request.cookies.set({ name, value, ...cookieOptions });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...cookieOptions });
        },
        remove(name: string, options: any) {
          const cookieOptions = {
            ...options,
            domain: cookieDomain,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
          };
          
          request.cookies.set({ name, value: "", ...cookieOptions });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: "", ...cookieOptions });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Rotas protegidas
  const protectedRoutes = ["/app"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Se não autenticado, redireciona para login no volvix.com.br
  if (isProtectedRoute && !user) {
    // Em desenvolvimento, permitir acesso sem autenticação
    if (process.env.NODE_ENV === 'development') {
      return response;
    }
    
    const loginUrl = new URL('https://volvix.com.br/auth/sign-in');
    
    // Validar URL atual antes de adicionar como redirect
    const currentUrl = request.url;
    if (validateRedirectUri(currentUrl)) {
      loginUrl.searchParams.set('redirect', currentUrl);
    } else {
      // Se URL inválida, usar apenas o path
      loginUrl.searchParams.set('redirect', `https://access.volvix.com.br${request.nextUrl.pathname}`);
    }
    
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (svg, png, jpg, jpeg, gif, webp)
     * - api routes (to allow proxy to work)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
