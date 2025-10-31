import { http } from "@/lib/http";

export interface Company {
  id: string;
  name: string;
  owner_id: string;
  unique_code?: string;
  expires_at?: string;
  created_at?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const companiesService = {
  // 📄 Lista todas as empresas (ADMIN only)
  async getAll(): Promise<Company[]> {
    return await http<Company[]>(`${BASE_URL}/api/access/companies`);
  },

  // ➕ Cria nova empresa
  async create(name: string): Promise<Company> {
    return await http<Company>(`${BASE_URL}/api/access/companies`, {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },

  // ✏️ Atualiza nome ou renova código
  async update(
    id: string,
    updates: { name?: string; renew_code?: boolean }
  ): Promise<Company> {
    return await http<Company>(`${BASE_URL}/api/access/companies`, {
      method: "PUT",
      body: JSON.stringify({ id, ...updates }),
    });
  },

  // ❌ Remove empresa
  async remove(id: string): Promise<{ success: boolean }> {
    return await http(`${BASE_URL}/api/access/companies`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
  },
};
