// ============================================
// GLOBAL SIGN-OUT - Syncro
// Logout sincronizado entre todas as abas e apps
// ============================================

/**
 * Realiza logout global no Syncro
 * - Chama API de logout do volvix-front
 * - Limpa localStorage/sessionStorage
 * - Notifica outras abas via BroadcastChannel
 * - Redireciona para login do volvix-front
 */
export async function globalSignOut() {
  try {
    // 1. Chamar API de logout do volvix-front
    await fetch('https://volvix.com.br/api/access/auth/sign-out', {
      method: 'POST',
      credentials: 'include',
    });

    // 2. Limpar storage local
    localStorage.clear();
    sessionStorage.clear();

    // 3. Notificar outras abas
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel('auth');
      channel.postMessage({ type: 'SIGN_OUT' });
      channel.close();
    }

    // 4. Redirecionar para login do volvix-front
    window.location.href = 'https://volvix.com.br/auth/sign-in';

  } catch (error) {
    console.error('[Syncro] Error during global sign-out:', error);
    // Mesmo com erro, limpar e redirecionar
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'https://volvix.com.br/auth/sign-in';
  }
}

/**
 * Listener para logout em outras abas
 * Usar em layout ou componente raiz
 */
export function setupGlobalSignOutListener() {
  if (typeof BroadcastChannel === 'undefined') {
    console.warn('[Syncro] BroadcastChannel not supported');
    return;
  }

  const channel = new BroadcastChannel('auth');

  channel.onmessage = (event) => {
    if (event.data.type === 'SIGN_OUT') {
      console.log('[Syncro GlobalSignOut] Received sign-out from another tab');
      // Limpar storage e redirecionar
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = 'https://volvix.com.br/auth/sign-in';
    }
  };

  // Cleanup
  return () => channel.close();
}
