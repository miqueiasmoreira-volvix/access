/**
 * Verifica se o usuário está autenticado checando cookies
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Verificar se existe cookie de sessão do Supabase
  const cookies = document.cookie.split(';');
  const hasAuthCookie = cookies.some(cookie => 
    cookie.trim().startsWith('sb-') || 
    cookie.trim().startsWith('access-token') ||
    cookie.trim().startsWith('refresh-token')
  );
  
  return hasAuthCookie;
}

/**
 * Redireciona para login se não autenticado
 */
export function requireAuth(redirectUrl?: string): void {
  if (!isAuthenticated()) {
    const currentUrl = redirectUrl || window.location.href;
    window.location.href = `https://volvix.com.br/auth/sign-in?redirect=${encodeURIComponent(currentUrl)}`;
  }
}

/**
 * Debug: Lista todos os cookies
 */
export function debugCookies(): void {
  console.log('[Auth Debug] Cookies:', document.cookie);
  console.log('[Auth Debug] Is Authenticated:', isAuthenticated());
}
