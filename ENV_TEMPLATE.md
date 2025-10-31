# Variáveis de Ambiente - Template

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# ============================================
# API Backend (volvix.com.br)
# ============================================
# IMPORTANTE: Use o mesmo domínio configurado no volvix-front
# Opção 1 (sem www): https://volvix.com.br
# Opção 2 (com www): https://www.volvix.com.br
NEXT_PUBLIC_API_URL=https://www.volvix.com.br

# ============================================
# Supabase Configuration
# ============================================
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# ============================================
# Environment
# ============================================
NODE_ENV=production
```

## Desenvolvimento Local

Para desenvolvimento local, use:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development
```

## Importante

- **Nunca commite** o arquivo `.env.local` (já está no .gitignore)
- Peça as credenciais reais ao time de DevOps
- Em produção, configure as variáveis no Vercel/Netlify/etc
- A URL da API deve apontar para o domínio onde `volvix-front` está rodando

## Configuração de CORS

Certifique-se de que o projeto `volvix-front` tenha a seguinte variável configurada:

```env
ALLOWED_REDIRECT_URIS=https://volvix.com.br,https://www.volvix.com.br,https://access.volvix.com.br
```

**IMPORTANTE:** Inclua **ambos** os domínios (com e sem `www`) se houver redirecionamento entre eles.

Isso permite que a aplicação `access` faça requisições cross-origin para a API.

## ⚠️ Rebuild Necessário

Após configurar as variáveis, você **DEVE** rebuildar a aplicação:

```bash
# Limpar build anterior
rm -rf .next

# Rebuild
pnpm build

# Restart
pnpm start
```

**Por quê?** Variáveis `NEXT_PUBLIC_*` são injetadas em **build time**, não em runtime.
