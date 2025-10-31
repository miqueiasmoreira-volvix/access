// ============================================
// VALIDATE REDIRECT URI - Syncro
// Previne Open Redirect vulnerabilities
// ============================================

/**
 * Valida se uma URI de redirect é permitida
 * @param uri - URI para validar
 * @returns true se válida, false se não
 */
export function validateRedirectUri(uri: string | null | undefined): boolean {
  // Se não houver URI, permitir (vai para default)
  if (!uri) {
    return true;
  }

  try {
    // Tentar parsear a URL
    const url = new URL(uri);

    // Whitelist hardcoded para Syncro (pode vir de env também)
    const allowedOrigins = [
      'https://volvix.com.br',
      'https://syncro.volvix.com.br',
      'http://localhost:3000',
      'http://localhost:3001',
    ];

    // Verificar se a origem (protocol + host) está na whitelist
    const origin = url.origin;

    const isAllowed = allowedOrigins.includes(origin);

    if (!isAllowed) {
      console.warn(`[Syncro validateRedirectUri] Blocked redirect to: ${uri}`);
    }

    return isAllowed;

  } catch (error) {
    // URL inválida
    console.error('[Syncro validateRedirectUri] Invalid URL:', uri);
    return false;
  }
}

/**
 * Sanitiza e valida redirect URI
 * Retorna URI válida ou fallback
 * @param uri - URI para validar
 * @param fallback - URI de fallback (default: '/')
 * @returns URI válida
 */
export function getSafeRedirectUri(uri: string | null | undefined, fallback: string = '/'): string {
  if (!uri) {
    return fallback;
  }

  const isValid = validateRedirectUri(uri);
  
  if (!isValid) {
    console.warn(`[Syncro getSafeRedirectUri] Using fallback for invalid URI: ${uri}`);
    return fallback;
  }

  return uri;
}
