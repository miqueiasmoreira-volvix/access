# Troubleshooting - Comunicação com API

## Problema: 401 Unauthorized

Se você está recebendo erros **401 Unauthorized** ao tentar acessar a API, siga este guia.

### Causas Comuns

#### 1. Variável `NEXT_PUBLIC_API_URL` não configurada

**Sintoma:** Requisições vão para o domínio errado ou retornam 401.

**Solução:**
```env
# .env.local
NEXT_PUBLIC_API_URL=https://volvix.com.br
```

**Como verificar:**
```bash
# No console do navegador
console.log(process.env.NEXT_PUBLIC_API_URL)
```

#### 2. CORS não configurado no backend

**Sintoma:** Erro de CORS no console do navegador.

**Solução:** Certifique-se de que o projeto `volvix-front` tem a seguinte configuração:

```env
# volvix-front/.env.local
ALLOWED_REDIRECT_URIS=https://volvix.com.br,https://www.volvix.com.br,https://access.volvix.com.br
```

**Como verificar:**
- Abra o DevTools (F12)
- Vá para a aba Network
- Faça uma requisição
- Verifique os headers de resposta:
  - `Access-Control-Allow-Origin` deve estar presente
  - `Access-Control-Allow-Credentials` deve ser `true`

#### 3. Cookies de autenticação não compartilhados

**Sintoma:** Usuário está logado mas API retorna 401.

**Causa:** Os cookies do Supabase não estão sendo enviados nas requisições cross-origin.

**Solução:**

1. **Configurar domínio dos cookies** (já implementado):
   ```typescript
   // middleware.ts
   const cookieDomain = process.env.NODE_ENV === 'production' ? '.volvix.com.br' : undefined;
   ```

2. **Verificar `credentials: 'include'`** (já implementado):
   ```typescript
   // lib/http.ts
   const response = await fetch(url, { 
     ...options, 
     headers,
     credentials: 'include', // ✅ Envia cookies
   });
   ```

3. **Verificar CORS no backend** (já implementado):
   ```typescript
   // volvix-front/middleware-api.ts
   response.headers.set('Access-Control-Allow-Credentials', 'true');
   ```

**Como verificar:**
- Abra o DevTools (F12)
- Vá para Application → Cookies
- Verifique se os cookies do Supabase existem:
  - `sb-<project>-auth-token`
  - Domain deve ser `.volvix.com.br`

#### 4. Usuário não está autenticado

**Sintoma:** Não há cookies de autenticação.

**Solução:** Faça login em `https://volvix.com.br/auth/sign-in`

### Checklist de Diagnóstico

- [ ] `.env.local` existe e está configurado
- [ ] `NEXT_PUBLIC_API_URL` aponta para o backend correto
- [ ] `ALLOWED_REDIRECT_URIS` inclui `https://access.volvix.com.br`
- [ ] Cookies do Supabase existem e têm domain `.volvix.com.br`
- [ ] Usuário está autenticado em `volvix.com.br`
- [ ] Headers CORS estão presentes nas respostas da API

### Logs Úteis

#### No navegador (DevTools Console):

```javascript
// Verificar variáveis de ambiente
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

// Verificar cookies
console.log('Cookies:', document.cookie);

// Verificar autenticação
fetch('https://volvix.com.br/api/access/users', {
  credentials: 'include'
}).then(r => console.log('Status:', r.status));
```

#### No servidor (volvix-front):

Os logs do middleware mostram:
```
[CORS] Origin: https://access.volvix.com.br
[CORS] Allowed Origins: [...]
[CORS] Is Allowed: true/false
```

### Desenvolvimento Local

Em desenvolvimento, use:

```env
# access/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development

# volvix-front/.env.local
ALLOWED_REDIRECT_URIS=http://localhost:3000,http://localhost:3001
NODE_ENV=development
```

**Nota:** Em desenvolvimento, os cookies não podem usar domain `.volvix.com.br`, então você pode precisar fazer login em `localhost:3001` diretamente.

### Ainda não funciona?

1. Limpe os cookies do navegador
2. Faça logout e login novamente
3. Verifique se ambos os servidores estão rodando
4. Verifique os logs do servidor (volvix-front)
5. Entre em contato com o time de DevOps
