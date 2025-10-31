"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { setupGlobalSignOutListener } from '@/lib/auth/global-signout';

/**
 * Componente para gerenciar sessão no Syncro
 * - Renova token a cada 50 minutos chamando API do volvix-front
 * - Detecta mudanças de rota e verifica sessão
 * - Sincroniza logout entre abas
 */
export default function SessionManager() {
  const pathname = usePathname();

  const refreshSession = async () => {
    try {
      const response = await fetch('https://volvix.com.br/api/access/auth/session/refresh', {
        method: 'POST',
        credentials: 'include', // Importante para enviar cookies
      });

      if (!response.ok) {
        console.error('[Syncro] Failed to refresh session');
        // Redirecionar para login se refresh falhar
        if (response.status === 401) {
          window.location.href = 'https://volvix.com.br/auth/sign-in?redirect=' + encodeURIComponent(window.location.href);
        }
        return false;
      }

      console.log('[Syncro] Session refreshed successfully');
      return true;

    } catch (error) {
      console.error('[Syncro] Error refreshing session:', error);
      return false;
    }
  };

  useEffect(() => {
    // Verificar sessão ao montar
    const checkSession = async () => {
      // Não verificar na home pública
      if (pathname === '/') {
        return;
      }

      await refreshSession();
    };

    checkSession();

    // Renovar sessão a cada 50 minutos (token expira em 60min)
    const interval = setInterval(async () => {
      console.log('[Syncro SessionManager] Refreshing session...');
      await refreshSession();
    }, 50 * 60 * 1000);

    return () => clearInterval(interval);
  }, [pathname]);

  // Listener para quando usuário volta para a aba
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        console.log('[Syncro SessionManager] Tab became visible, checking session...');
        await refreshSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Listener para logout global entre abas
  useEffect(() => {
    const cleanup = setupGlobalSignOutListener();
    return cleanup;
  }, []);

  return null; // Componente invisível
}
