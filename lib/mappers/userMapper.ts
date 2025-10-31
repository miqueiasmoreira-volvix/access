import { User } from "@/services/access/users/usersService";

export interface UserUI {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  access: string[];
  lastActive: string;
  dateAdded: string;
  company_id?: string;
  status: string;
}

// Mapeamento de roles para permissões (pode ser expandido conforme necessário)
const rolePermissionsMap: Record<string, string[]> = {
  admin: ['Admin', 'Data Export', 'Data Import', 'User Management'],
  manager: ['Data Export', 'Data Import', 'User Management'],
  user: ['Data Export'],
  viewer: [],
};

// Gera avatar baseado no email usando DiceBear API
function generateAvatar(email: string): string {
  const seed = email.toLowerCase();
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
}

// Formata data para exibição
function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Converte User (API) → UserUI (Frontend)
export function mapUserToUI(user: User): UserUI {
  const fullName = `${user.first_name} ${user.last_name}`.trim();
  const role = user.role || 'user';
  const permissions = rolePermissionsMap[role.toLowerCase()] || [];

  return {
    id: user.id,
    name: fullName,
    email: user.email,
    avatar: generateAvatar(user.email),
    role: role.charAt(0).toUpperCase() + role.slice(1),
    access: permissions,
    lastActive: formatDate(user.created_at), // TODO: Adicionar last_active no backend
    dateAdded: formatDate(user.created_at),
    company_id: user.company_id,
    status: 'active', // TODO: Adicionar status no backend
  };
}

// Converte array de Users
export function mapUsersToUI(users: User[]): UserUI[] {
  return users.map(mapUserToUI);
}
