# ⚠️ REBUILD NECESSÁRIO

## Problema Identificado

A aplicação está fazendo requisições para `https://access.volvix.com.br/api/access/users` ao invés de `https://www.volvix.com.br/api/access/users`.

Isso acontece porque as variáveis `NEXT_PUBLIC_*` são injetadas durante o **build**, não em runtime.

## Solução

Execute os seguintes comandos:

```bash
# 1. Limpar build anterior
rm -rf .next

# 2. Rebuild com as novas variáveis
pnpm build

# 3. Restart do servidor
pnpm start
```

## Verificação

Após o rebuild, verifique no console do navegador:

```javascript
// Deve retornar: https://www.volvix.com.br
console.log(process.env.NEXT_PUBLIC_API_URL)
```

## Desenvolvimento

Se estiver em desenvolvimento, basta reiniciar o servidor:

```bash
# Ctrl+C para parar
pnpm dev
```

O Next.js em modo dev recarrega as variáveis automaticamente.

## Importante

- ✅ Variáveis `NEXT_PUBLIC_*` são injetadas em **build time**
- ✅ Sempre rebuilde após alterar `.env.local`
- ✅ Em produção, configure as variáveis no Vercel/Netlify antes do deploy
- ❌ Não é possível mudar essas variáveis sem rebuild

## Checklist Pós-Rebuild

- [ ] Rebuild executado com sucesso
- [ ] Servidor reiniciado
- [ ] Console mostra URL correta: `https://www.volvix.com.br`
- [ ] Requisições vão para `www.volvix.com.br/api/*`
- [ ] Erro 401 resolvido (se usuário estiver autenticado)
