"use client";
import useSWR from "swr";
import { usersService, User } from "@/services/access/users/usersService";
import { HttpError } from "@/lib/http";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export function useUsers() {
  const {
    data: users,
    error,
    isLoading,
    mutate,
  } = useSWR<User[]>(`${BASE_URL}/api/access/users`, () => usersService.getAll(), {
    revalidateOnFocus: false,
  });

  async function createUser(payload: {
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    company_id: string;
    role_id: string;
  }) {
    try {
      const newUser = await usersService.create(payload);
      mutate((prev) => (prev ? [...prev, newUser] : [newUser]), false);
      return newUser;
    } catch (err) {
      if (err instanceof HttpError) throw err;
      throw new Error("Erro ao criar usuário");
    }
  }

  async function updateUser(id: string, updates: Partial<User>) {
    try {
      const updated = await usersService.update(id, updates);
      mutate(
        (prev) =>
          prev?.map((u) => (u.id === id ? { ...u, ...updated } : u)) || [],
        false
      );
      return updated;
    } catch (err) {
      throw new HttpError("Erro ao atualizar usuário", 400);
    }
  }

  async function deleteUser(id: string) {
    try {
      await usersService.remove(id);
      mutate((prev) => prev?.filter((u) => u.id !== id) || [], false);
    } catch (err) {
      throw new HttpError("Erro ao excluir usuário", 400);
    }
  }

  return {
    users,
    isLoading,
    isError: Boolean(error),
    createUser,
    updateUser,
    deleteUser,
    refresh: mutate,
  };
}
