import { http } from "@/lib/http";

export interface Role {
  id: string;
  name: string;
  description?: string;
  is_default?: boolean;
  company_id?: string | null;
  created_by?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const rolesService = {
  // 📄 Lista roles (globais + da empresa)
  async getAll(): Promise<Role[]> {
    return await http<Role[]>(`${BASE_URL}/api/access/roles`);
  },

  // ➕ Cria nova role
  async create(payload: { name: string; description?: string }): Promise<Role> {
    return await http<Role>(`${BASE_URL}/api/access/roles`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // ✏️ Atualiza role existente
  async update(
    id: string,
    updates: Partial<Omit<Role, "id">>
  ): Promise<Role> {
    return await http<Role>(`${BASE_URL}/api/access/roles`, {
      method: "PUT",
      body: JSON.stringify({ id, ...updates }),
    });
  },

  // ❌ Remove role
  async remove(id: string): Promise<{ success: boolean }> {
    return await http(`${BASE_URL}/api/access/roles`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
  },
};
