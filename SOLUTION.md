# 🔧 Solução para Erro 403/406

## Diagnóstico Completo

### ✅ Problema 1: URL Incorreta (RESOLVIDO)
A aplicação estava fazendo requisições para o **domínio errado**:
- ❌ **Antes:** `https://access.volvix.com.br/api/access/users`
- ✅ **Depois:** `https://www.volvix.com.br/api/access/users`

**Solução:** Rebuild da aplicação após configurar `NEXT_PUBLIC_API_URL`.

### 🔴 Problema 2: Erro 403/406 - Cookies Cross-Origin (PRINCIPAL)

**Sintomas:**
- Navegador: `403 Forbidden`
- Supabase: `406 Not Acceptable`
- Ocorre nas rotas: `/api/access/users`, `/api/access/companies`, `/api/access/roles`

**Causa:**
O `getSupabaseServer()` no backend usa `cookies()` do Next.js, que **não lê cookies de requisições cross-origin** automaticamente, mesmo com `credentials: 'include'`.

**Solução Implementada no Backend:**
Foi criado `getSupabaseServerFromRequest()` que extrai cookies do header `Cookie` da requisição HTTP.

## Solução Imediata

### ✅ Backend (volvix-front) - JÁ IMPLEMENTADO

As seguintes alterações foram feitas no backend:

1. **Criado:** `utils/supabase/server-request.ts`
   - Nova função que lê cookies do header HTTP
   
2. **Atualizadas as rotas:**
   - `/api/access/users/route.ts`
   - `/api/access/companies/route.ts`
   - `/api/access/roles/route.ts`

**Ação necessária:** Reinicie o servidor `volvix-front`:

```bash
cd d:\volvix\volvix-front

# Parar servidor (Ctrl+C)
# Reiniciar
pnpm dev
```

### ✅ Frontend (access) - SE NECESSÁRIO

Se você ainda não fez rebuild após configurar `NEXT_PUBLIC_API_URL`:

```bash
cd d:\volvix\access

# Limpar build anterior
rm -rf .next

# Rebuild com as novas variáveis
pnpm build

# Restart do servidor
pnpm start
```

Ou em desenvolvimento:

```bash
cd d:\volvix\access

# Parar servidor (Ctrl+C)
# Reiniciar
pnpm dev
```

## Verificação

Após rebuild, abra o DevTools (F12) e execute:

```javascript
// 1. Verificar variável
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
// Deve retornar: https://www.volvix.com.br

// 2. Fazer uma requisição de teste
fetch('https://www.volvix.com.br/api/access/users', {
  credentials: 'include'
})
.then(r => console.log('Status:', r.status, r.statusText))
.catch(e => console.error('Erro:', e));
```

## Problemas Secundários

### 1. CORS - www vs não-www

**Situação atual:**
- API aceita: `https://access.volvix.com.br` ✅
- API roda em: `https://www.volvix.com.br` ⚠️
- Lista CORS não inclui: `https://www.volvix.com.br` ❌

**Impacto:** Se houver redirecionamento de `volvix.com.br` → `www.volvix.com.br`, pode causar problemas de CORS.

**Solução:** Adicionar `https://www.volvix.com.br` na lista:

```env
# volvix-front/.env.local
ALLOWED_REDIRECT_URIS=https://volvix.com.br,https://www.volvix.com.br,https://syncro.volvix.com.br,https://pulse.volvix.com.br,https://labs.volvix.com.br,https://orbit.volvix.com.br,https://nexus.volvix.com.br,https://architec.volvix.com.br,https://access.volvix.com.br
```

### 2. Consistência de Domínios

**Recomendação:** Usar **um único domínio** para a API:

**Opção A: Sem www**
```env
# access/.env.local
NEXT_PUBLIC_API_URL=https://volvix.com.br

# volvix-front/.env.local
ALLOWED_REDIRECT_URIS=https://volvix.com.br,...
```

**Opção B: Com www**
```env
# access/.env.local
NEXT_PUBLIC_API_URL=https://www.volvix.com.br

# volvix-front/.env.local
ALLOWED_REDIRECT_URIS=https://www.volvix.com.br,...
```

**Importante:** Ambos os domínios devem estar na lista CORS se houver redirecionamento.

## Checklist de Resolução

- [ ] Rebuild executado (`rm -rf .next && pnpm build`)
- [ ] Servidor reiniciado (`pnpm start`)
- [ ] Variável verificada no console (`process.env.NEXT_PUBLIC_API_URL`)
- [ ] Requisições vão para `www.volvix.com.br/api/*`
- [ ] `https://www.volvix.com.br` adicionado em `ALLOWED_REDIRECT_URIS`
- [ ] Usuário está autenticado em `volvix.com.br` ou `www.volvix.com.br`
- [ ] Cookies têm domain `.volvix.com.br`
- [ ] Erro 401 resolvido

## Teste Final

Execute este script no console do navegador:

```javascript
// Teste completo
(async () => {
  console.group('🔍 Diagnóstico de Comunicação API');
  
  // 1. Variáveis
  console.log('1️⃣ API URL:', process.env.NEXT_PUBLIC_API_URL);
  
  // 2. Cookies
  const cookies = document.cookie.split(';').map(c => c.trim());
  const authCookies = cookies.filter(c => c.includes('sb-'));
  console.log('2️⃣ Auth Cookies:', authCookies.length > 0 ? '✅ Encontrados' : '❌ Não encontrados');
  
  // 3. Requisição
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/access/users`, {
      credentials: 'include'
    });
    console.log('3️⃣ Status:', response.status, response.statusText);
    
    if (response.ok) {
      console.log('✅ Comunicação funcionando!');
    } else if (response.status === 401) {
      console.log('❌ 401: Usuário não autenticado ou cookies não enviados');
    } else if (response.status === 403) {
      console.log('❌ 403: Usuário sem permissão');
    } else {
      console.log('❌ Erro:', response.status);
    }
  } catch (error) {
    console.error('❌ Erro de rede:', error);
  }
  
  console.groupEnd();
})();
```

## Ainda não funciona?

1. **Limpe o cache do navegador** (Ctrl+Shift+Delete)
2. **Faça logout e login novamente** em `volvix.com.br`
3. **Verifique os logs do servidor** `volvix-front` para ver mensagens de CORS
4. **Confirme que ambos os servidores estão rodando**
5. **Entre em contato com DevOps** se o problema persistir

## Documentação Adicional

- [ENV_TEMPLATE.md](./ENV_TEMPLATE.md) - Template de variáveis
- [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) - Guia de troubleshooting
- [API_COMMUNICATION.md](./docs/API_COMMUNICATION.md) - Arquitetura de comunicação
