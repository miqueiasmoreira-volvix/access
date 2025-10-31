import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export const getSupabaseServer = async () => {
  const cookieStore = await cookies();
  const cookieDomain = process.env.NODE_ENV === 'production' ? '.volvix.com.br' : undefined;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookieToSet: Array<{ name: string; value: string; options: CookieOptions}>) => {
          try {
            cookieToSet.forEach(({ name, value, options}) => 
              cookieStore.set(name, value, {
                ...options,
                domain: cookieDomain,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
              })
            );
          } catch (error) {
            console.error("Erro ao definir cookies:", error);
          }
        },
      },
    },
  )

  return supabase;
}