import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy API Route para encaminhar requisições para volvix.com.br
 * Mantém cookies e headers de autenticação
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path, 'DELETE');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path, 'PATCH');
}

async function proxyRequest(
  request: NextRequest,
  path: string[],
  method: string
) {
  try {
    const targetPath = path.join('/');
    const targetUrl = `https://volvix.com.br/api/${targetPath}`;
    
    // Debug: Log da requisição
    console.log('[Proxy API] Request:', {
      method,
      targetUrl,
      hasCookies: !!request.headers.get('cookie'),
    });
    
    // Copiar headers importantes
    const headers: HeadersInit = {
      'Content-Type': request.headers.get('content-type') || 'application/json',
    };

    // Copiar cookies do request
    const cookies = request.headers.get('cookie');
    if (cookies) {
      headers['Cookie'] = cookies;
      console.log('[Proxy API] Forwarding cookies:', cookies.substring(0, 100) + '...');
    } else {
      console.warn('[Proxy API] ⚠️ No cookies in request!');
    }

    // Preparar body se necessário
    let body: string | undefined;
    if (method !== 'GET' && method !== 'DELETE') {
      try {
        body = await request.text();
      } catch (e) {
        // Sem body
      }
    }

    // Fazer requisição para o backend
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
      credentials: 'include',
    });

    // Debug: Log da response
    console.log('[Proxy API] Response:', {
      status: response.status,
      statusText: response.statusText,
      hasSetCookie: !!response.headers.get('set-cookie'),
    });

    // Copiar response body
    const responseData = await response.text();

    // Criar response com mesmo status
    const nextResponse = new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText,
    });

    // Copiar headers importantes da response
    const contentType = response.headers.get('content-type');
    if (contentType) {
      nextResponse.headers.set('content-type', contentType);
    }

    // Copiar cookies da response
    const setCookies = response.headers.get('set-cookie');
    if (setCookies) {
      nextResponse.headers.set('set-cookie', setCookies);
    }

    return nextResponse;

  } catch (error) {
    console.error('[Proxy API] Error:', error);
    return NextResponse.json(
      { error: 'Proxy request failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
