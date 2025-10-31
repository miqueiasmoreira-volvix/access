# Comunicação com API - Arquitetura

## Visão Geral

A aplicação `access` (https://access.volvix.com.br) consome APIs do backend `volvix-front` (https://volvix.com.br).

```
┌─────────────────────┐         ┌─────────────────────┐
│  access.volvix.com  │  ────>  │   volvix.com.br     │
│  (Frontend Client)  │         │   (API Backend)     │
└─────────────────────┘         └─────────────────────┘
         │                                │
         │                                │
         └────────── Cookies ─────────────┘
              (domain: .volvix.com.br)
```

## Fluxo de Autenticação

1. **Login:** Usuário faz login em `volvix.com.br/auth/sign-in`
2. **Cookies:** Supabase cria cookies com domain `.volvix.com.br`
3. **Acesso:** Usuário navega para `access.volvix.com.br`
4. **Requisições:** `access` faz requisições para `volvix.com.br/api/*`
5. **Autenticação:** Cookies são enviados automaticamente (credentials: 'include')
6. **Autorização:** API valida o usuário via Supabase

## Componentes

### 1. Cliente HTTP (`access/lib/http.ts`)

```typescript
export async function http<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, { 
    ...options, 
    headers: { "Content-Type": "application/json", ...options.headers },
    credentials: 'include', // ✅ Envia cookies cross-origin
  });
  // ...
}
```

**Responsabilidades:**
- Fazer requisições HTTP
- Enviar cookies de autenticação
- Tratar erros padronizados

### 2. Services (`access/services/access/*`)

```typescript
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const usersService = {
  async getAll(): Promise<User[]> {
    return await http<User[]>(`${BASE_URL}/api/access/users`);
  },
  // ...
};
```

**Responsabilidades:**
- Construir URLs da API
- Definir interfaces de dados
- Expor métodos CRUD

### 3. Middleware CORS (`volvix-front/middleware-api.ts`)

```typescript
export function apiMiddleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  const allowedOrigins = process.env.ALLOWED_REDIRECT_URIS?.split(',') || [];
  
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }
  // ...
}
```

**Responsabilidades:**
- Validar origem da requisição
- Adicionar headers CORS
- Permitir envio de cookies

### 4. API Routes (`volvix-front/app/api/access/*/route.ts`)

```typescript
export async function GET() {
  const supabase = await getSupabaseServer();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) return Unauthorized();
  // ...
}
```

**Responsabilidades:**
- Validar autenticação
- Verificar permissões
- Retornar dados

## Configuração Necessária

### access/.env.local
```env
NEXT_PUBLIC_API_URL=https://volvix.com.br
NEXT_PUBLIC_SUPABASE_URL=<supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-key>
```

### volvix-front/.env.local
```env
ALLOWED_REDIRECT_URIS=https://volvix.com.br,https://www.volvix.com.br,https://access.volvix.com.br
NEXT_PUBLIC_SUPABASE_URL=<supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-key>
```

## Segurança

### 1. CORS Restritivo
Apenas origens em `ALLOWED_REDIRECT_URIS` podem fazer requisições.

### 2. Cookies HttpOnly
```typescript
const cookieOptions = {
  domain: '.volvix.com.br',
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
};
```

### 3. Autenticação Obrigatória
Todas as rotas `/api/access/*` requerem autenticação via Supabase.

### 4. Autorização por Role
```typescript
const roleData = await getUserRole(supabase, user.id);
if (!["ADMIN", "MANAGER"].includes(roleData?.roles.name)) {
  return Forbidden();
}
```

## Troubleshooting

Veja [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) para resolver problemas comuns.

## Desenvolvimento Local

Em desenvolvimento, você pode:

1. **Rodar ambos os projetos localmente:**
   ```bash
   # Terminal 1 - volvix-front
   cd volvix-front
   pnpm dev # porta 3000

   # Terminal 2 - access
   cd access
   pnpm dev # porta 3001
   ```

2. **Configurar variáveis:**
   ```env
   # access/.env.local
   NEXT_PUBLIC_API_URL=http://localhost:3000
   
   # volvix-front/.env.local
   ALLOWED_REDIRECT_URIS=http://localhost:3000,http://localhost:3001
   ```

3. **Fazer login em localhost:3000**

**Nota:** Em desenvolvimento, os cookies não podem usar domain compartilhado, então você precisa fazer login no mesmo domínio onde a API está rodando.
