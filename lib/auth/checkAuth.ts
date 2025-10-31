/**
 * Verifica se o usuário está autenticado checando cookies
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Verificar se existe o novo cookie único do Supabase
  // Formato: sb-<project-ref>-auth-token
  const cookies = document.cookie.split(';');
  const hasAuthCookie = cookies.some(cookie => {
    const trimmed = cookie.trim();
    return trimmed.match(/^sb-[a-z0-9]+-auth-token=/);
  });
  
  return hasAuthCookie;
}

/**
 * Obtém o token de autenticação do cookie do Supabase
 */
export function getAuthToken(): { access_token?: string; refresh_token?: string; expires_at?: number } | null {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => {
    const trimmed = cookie.trim();
    return trimmed.match(/^sb-[a-z0-9]+-auth-token=/);
  });
  
  if (!authCookie) return null;
  
  try {
    const value = authCookie.split('=')[1];
    const decoded = decodeURIComponent(value);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('[Auth] Failed to parse auth cookie:', error);
    return null;
  }
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
 * Debug: Lista todos os cookies e detalhes de autenticação
 */
export function debugCookies(): void {
  console.log('[Auth Debug] All Cookies:', document.cookie);
  console.log('[Auth Debug] Is Authenticated:', isAuthenticated());
  
  const token = getAuthToken();
  if (token) {
    console.log('[Auth Debug] Token Info:', {
      hasAccessToken: !!token.access_token,
      hasRefreshToken: !!token.refresh_token,
      expiresAt: token.expires_at ? new Date(token.expires_at * 1000).toISOString() : 'N/A',
      isExpired: token.expires_at ? Date.now() / 1000 > token.expires_at : 'Unknown',
    });
  } else {
    console.warn('[Auth Debug] ⚠️ No auth token found!');
  }
}
