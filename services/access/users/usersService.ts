import { http } from "@/lib/http";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role?: string;
  company_id?: string;
  created_at?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const usersService = {
  async getAll(): Promise<User[]> {
    return await http<User[]>(`${BASE_URL}/api/access/users`);
  },

  async create(payload: {
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    company_id: string;
    role_id: string;
  }): Promise<User> {
    return await http<User>(`${BASE_URL}/api/access/users`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async update(id: string, updates: Partial<User>): Promise<User> {
    return await http<User>(`${BASE_URL}/api/access/users`, {
      method: "PUT",
      body: JSON.stringify({ id, ...updates }),
    });
  },

  async remove(id: string): Promise<{ success: boolean }> {
    return await http(`${BASE_URL}/api/access/users`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
  },
};
