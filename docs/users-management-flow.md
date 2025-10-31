# 📋 Fluxo Completo da Tela Users Management

## Visão Geral
Documentação detalhada do fluxo de funcionamento da página de gerenciamento de usuários, desde o acesso até as interações CRUD.

---

## 🔐 Fluxo de Autenticação e Carregamento

### **1. Usuário com role 'ADMIN' acessa o painel**
- Acessa `https://access.volvix.com.br/app/users-management`

### **2. Middleware intercepta a requisição**
**Arquivo:** `middleware.ts`

- Middleware verifica se a rota `/app/*` é protegida
- Cria cliente Supabase SSR com cookies do domínio `.volvix.com.br`
- Chama `supabase.auth.getUser()` para validar sessão
- **Se não autenticado:** redireciona para `https://volvix.com.br/auth/sign-in`
- **Se autenticado:** permite acesso e continua

### **3. Página users-management é renderizada**
**Arquivo:** `app/app/users-management/page.tsx`

- Componente `UsersManagement` é montado
- `useEffect` executa `debugCookies()` para debug

### **4. Debug de cookies no browser**
**Arquivo:** `lib/auth/checkAuth.ts`

```typescript
debugCookies()
```

**Processo:**
- Lê `document.cookie`
- Procura por cookie `sb-<project-ref>-auth-token`
- Extrai e parseia JSON: `{ access_token, refresh_token, expires_at }`
- Loga no console se está autenticado e se token expirou

---

## 📊 Fluxo de Busca de Dados

### **5. Hook useUsers() busca dados**
**Arquivo:** `hooks/useUsers.ts`

```typescript
const { users, isLoading } = useUsers()
```

- SWR faz requisição: `fetch('/api/access/users', { credentials: 'include' })`
- Envia cookies automaticamente (incluindo `sb-*-auth-token`)

### **6. Requisição passa pelo Proxy API Route**
**Arquivo:** `app/api/[...path]/route.ts`

```typescript
GET handler → proxyRequest()
```

**Processo:**
1. Recebe requisição em `/api/access/users`
2. Extrai cookies do header `request.headers.get('cookie')`
3. **Parseia cookie único do Supabase:**
   - Encontra `sb-<project-ref>-auth-token=...`
   - Decodifica URL encoding
   - Parseia JSON
   - Extrai `access_token`
4. **Adiciona header Authorization:**
   - `Authorization: Bearer <access_token>`
5. **Faz proxy para backend:**
   ```typescript
   fetch('https://volvix.com.br/api/access/users', {
     headers: {
       Cookie: '...',
       Authorization: 'Bearer <token>'
     }
   })
   ```

### **7. Backend processa requisição**
**Endpoint:** `https://volvix.com.br/api/access/users`

**Processo:**
- Recebe requisição com headers de autenticação
- Valida JWT do header `Authorization`
- Verifica role do usuário (deve ser ADMIN)
- Busca usuários no banco de dados (Supabase)
- Retorna JSON: `{ success: true, data: [...users] }`

### **8. Proxy retorna response**
- Copia status, headers e body da response do backend
- Retorna para o browser

### **9. Hook useUsers() processa dados**
**Arquivo:** `services/access/users/usersService.ts` → `lib/http.ts`

```typescript
usersService.getAll() → http<User[]>()
```

**Processo:**
- Recebe response JSON
- Valida formato `{ success, data }`
- **Se `success: true`:** retorna `data`
- **Se erro:** lança `HttpError`

---

## 🔄 Transformação de Dados

### **10. Mapper transforma dados**
**Arquivo:** `lib/mappers/userMapper.ts`

```typescript
mapUsersToUI(users)
```

**Transformações:**
- Concatena `first_name + last_name` → `name`
- Gera avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
- Mapeia `role` → `access` (array de permissões)
  - `admin` → `['Admin', 'Data Export', 'Data Import', 'User Management']`
  - `manager` → `['Data Export', 'Data Import', 'User Management']`
  - `user` → `['Data Export']`
- Formata datas: `created_at` → `"Mar 4, 2024"`

**Estrutura:**
```typescript
User (API) → UserUI (Frontend)
{
  id: string,
  first_name: string,
  last_name: string,
  email: string,
  role: string,
  created_at: string
}
→
{
  id: string,
  name: string,              // first_name + last_name
  email: string,
  avatar: string,            // URL gerada
  role: string,              // Capitalizado
  access: string[],          // Permissões mapeadas
  lastActive: string,        // Data formatada
  dateAdded: string,         // Data formatada
  company_id?: string,
  status: string             // 'active'
}
```

---

## 🎨 Renderização da Interface

### **11. Componente renderiza UI**

#### **Loading State:**
```typescript
if (isLoading) {
  return <LoadingSpinner />
}
```

#### **Dados Carregados:**

**Header:**
- Título "All users" + `<CountBadge count={users.length} />`
- `<SearchInput />` para busca client-side
- Botão "Filters" (placeholder)
- Botão "Add user" → abre `<CreateUserModal />`

**Tabela:**
- Componentes do design system: `<Table>`, `<TableHeader>`, `<TableBody>`, etc.
- **Cada linha mostra:**
  - `<TableCheckbox />` para seleção
  - Avatar gerado (DiceBear)
  - Nome completo
  - Email
  - `<StatusBadge />` para cada permissão
  - Data de último acesso
  - Data de criação
  - `<ActionMenu />` com opções

**Paginação:**
- Componentes `<PaginationButton />` (placeholder)

### **12. Filtros client-side (useMemo)**

```typescript
const filteredUsers = useMemo(() => {
  return usersUI.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [usersUI, searchQuery]);
```

**Características:**
- Busca em tempo real
- Filtra por: nome, email, role
- Performance otimizada com `useMemo`

---

## 🔧 Interações do Usuário

### **13A. Criar Usuário**

**Fluxo:**
1. Usuário clica "Add user"
2. `<CreateUserModal />` abre
3. Formulário exibe campos:
   - Nome e Sobrenome
   - E-mail
   - Telefone (opcional)
   - Role (dropdown com `useRoles()`)
   - Empresa (dropdown com `useCompanies()` - apenas SUPER ADMIN)
4. Usuário preenche e clica "Criar Usuário"
5. Modal chama `handleCreateUser(data)`
6. Hook executa `createUser(payload)`
7. Faz `POST /api/access/users` com:
   ```json
   {
     "email": "user@example.com",
     "first_name": "John",
     "last_name": "Doe",
     "phone": "+5511999999999",
     "company_id": "uuid",
     "role_id": "uuid"
   }
   ```
8. Proxy encaminha com `Authorization` header
9. Backend cria usuário no Supabase
10. SWR atualiza cache local com `mutate()`
11. Lista atualiza automaticamente
12. Modal fecha

### **13B. Deletar Usuário**

**Fluxo:**
1. Usuário clica no menu (três pontos)
2. Seleciona "Delete user"
3. Confirma com `confirm('Tem certeza que deseja excluir este usuário?')`
4. Hook chama `handleDeleteUser(userId)`
5. Executa `deleteUser(id)`
6. Faz `DELETE /api/access/users` com:
   ```json
   { "id": "uuid" }
   ```
7. Backend remove do banco de dados
8. SWR remove do cache local
9. Lista atualiza automaticamente

### **13C. Ver Perfil**

**Fluxo:**
1. Usuário clica no menu (três pontos)
2. Seleciona "View profile"
3. Executa `handleViewProfile(userId)`
4. Navega para `/app/users-management/[id]`
5. Página de detalhes do usuário (a ser implementada)

---

## ⏱️ Processos em Background

### **14. SessionManager - Renovação Automática**
**Arquivo:** `components/SessionManager.tsx`

**Processo:**
- Roda em paralelo no layout da aplicação
- **A cada 50 minutos:**
  1. Chama `POST /api/access/auth/session/refresh`
  2. Backend renova tokens
  3. Atualiza cookie `sb-*-auth-token`
- **Se refresh falhar:**
  - Redireciona para `https://volvix.com.br/auth/sign-in`
- **Quando usuário volta para a aba:**
  - Verifica sessão automaticamente
- **Sincronização entre abas:**
  - Usa `BroadcastChannel` para logout global

---

## 📊 Diagrama de Fluxo Resumido

```
┌─────────────────────────────────────────────────────────────┐
│ Browser (access.volvix.com.br)                              │
│  ↓ [1] Acessa /app/users-management                         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Middleware (middleware.ts)                                   │
│  ↓ [2] Valida sessão Supabase                               │
│  ↓ Se OK → continua | Se não → redirect login               │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Página Users Management (page.tsx)                          │
│  ↓ [3] Renderiza componente                                 │
│  ↓ [4] debugCookies() - verifica auth                       │
│  ↓ [5] useUsers() - busca dados                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Proxy API Route (app/api/[...path]/route.ts)               │
│  ↓ [6] Extrai access_token do cookie                        │
│  ↓ Adiciona Authorization header                            │
│  ↓ Faz proxy para backend                                   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Backend (volvix.com.br)                                      │
│  ↓ [7] Valida JWT                                           │
│  ↓ Busca usuários no DB                                     │
│  ↓ Retorna JSON                                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Proxy → Browser                                              │
│  ↓ [8-9] Response volta                                     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Mapper (lib/mappers/userMapper.ts)                          │
│  ↓ [10] User → UserUI                                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ UI (Renderização)                                            │
│  ↓ [11] Renderiza tabela                                    │
│  ↓ [12] Filtros client-side                                 │
│  ↓ [13] Interações (CRUD)                                   │
│  ↓ [14] SessionManager refresh                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 Pontos-Chave de Segurança

### **Cookies:**
- **Nome:** `sb-<project-ref>-auth-token`
- **Domínio:** `.volvix.com.br` (compartilhado entre subdomínios)
- **Flags:** `HttpOnly`, `Secure` (prod), `SameSite=Lax`
- **Conteúdo:** JSON com `access_token`, `refresh_token`, `expires_at`

### **Autenticação:**
- Middleware valida sessão em todas as rotas `/app/*`
- Proxy extrai `access_token` e adiciona como `Authorization: Bearer`
- Backend valida JWT em cada requisição
- Tokens renovados automaticamente a cada 50 minutos

### **Autorização:**
- SUPER ADMIN (`company_id: null`) → acesso global
- ADMIN de empresa → acesso apenas à sua empresa
- Verificação de role no backend para cada operação

---

## 📁 Arquivos Principais

| Arquivo | Responsabilidade |
|---------|------------------|
| `middleware.ts` | Validação de sessão SSR |
| `app/app/users-management/page.tsx` | Componente principal da página |
| `app/api/[...path]/route.ts` | Proxy API com extração de tokens |
| `hooks/useUsers.ts` | Hook SWR para gerenciar estado |
| `services/access/users/usersService.ts` | Serviço de comunicação com API |
| `lib/http.ts` | Cliente HTTP com `credentials: 'include'` |
| `lib/mappers/userMapper.ts` | Transformação User → UserUI |
| `lib/auth/checkAuth.ts` | Utilitários de autenticação |
| `components/SessionManager.tsx` | Renovação automática de sessão |
| `components/modals/CreateUserModal.tsx` | Modal de criação de usuário |

---

## 🐛 Debug e Troubleshooting

### **Verificar Autenticação:**
```javascript
// No console do browser
debugCookies()
```

**Output esperado:**
```
[Auth Debug] All Cookies: sb-abc123-auth-token=...
[Auth Debug] Is Authenticated: true
[Auth Debug] Token Info: {
  hasAccessToken: true,
  hasRefreshToken: true,
  expiresAt: "2025-10-31T06:00:00.000Z",
  isExpired: false
}
```

### **Verificar Proxy:**
```
// Logs do servidor (terminal)
[Proxy API] Request: { method: 'GET', targetUrl: '...', hasCookies: true }
[Proxy API] ✅ Added Authorization header from cookie
[Proxy API] Response: { status: 200, statusText: 'OK' }
```

### **Erros Comuns:**

| Erro | Causa | Solução |
|------|-------|---------|
| 401 Unauthorized | Token ausente ou inválido | Verificar cookies, fazer login novamente |
| 403 Forbidden | Usuário sem permissão | Verificar role do usuário |
| CORS Error | Requisição direta para volvix.com.br | Usar proxy `/api/*` |
| Token expirado | Sessão expirou | SessionManager deve renovar automaticamente |

---

## 🚀 Melhorias Futuras

- [ ] Implementar página de detalhes do usuário (`/app/users-management/[id]`)
- [ ] Adicionar filtros avançados (por role, empresa, status)
- [ ] Implementar paginação server-side para grandes volumes
- [ ] Adicionar edição inline de usuários
- [ ] Implementar change permission (integração com roles-management)
- [ ] Export de dados (CSV/JSON)
- [ ] Logs de auditoria (quem criou/editou/deletou)
- [ ] Bulk actions (deletar/editar múltiplos usuários)

---

**Última atualização:** 31 de Outubro de 2025  
**Versão:** 1.0.0
