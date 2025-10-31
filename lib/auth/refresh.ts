// ============================================
// REFRESH TOKEN - Syncro Helper
// ============================================

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Tenta renovar a sessão chamando API do volvix-front
 * @returns true se sucesso, false se falhou
 */
export async function refreshSession(): Promise<boolean> {
  // Se já está refreshing, aguarda a promise existente
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      const response = await fetch('/api/access/auth/session/refresh', {
        method: 'POST',
        credentials: 'include', // Importante para enviar cookies
      });

      if (!response.ok) {
        console.error('[Syncro] Failed to refresh session');
        return false;
      }

      console.log('[Syncro] Session refreshed successfully');
      return true;

    } catch (error) {
      console.error('[Syncro] Error refreshing session:', error);
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Interceptor para fetch - adiciona refresh automático
 * Usar para chamadas à API do volvix-front
 */
export async function fetchWithRefresh(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Primeira tentativa
  let response = await fetch(url, {
    ...options,
    credentials: 'include',
  });

  // Se 401 (não autorizado), tenta refresh
  if (response.status === 401) {
    console.log('[Syncro] Token expired, attempting refresh...');
    
    const refreshed = await refreshSession();

    if (refreshed) {
      // Retry request original
      console.log('[Syncro] Retrying original request...');
      response = await fetch(url, {
        ...options,
        credentials: 'include',
      });
    } else {
      // Refresh falhou - redirecionar para login
      console.log('[Syncro] Refresh failed, redirecting to login...');
      window.location.href = 'https://volvix.com.br/auth/sign-in?redirect=' + encodeURIComponent(window.location.href);
    }
  }

  return response;
}
