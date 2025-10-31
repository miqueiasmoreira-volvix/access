"use client";
import useSWR from "swr";
import { rolesService, Role } from "@/services/access/roles/roleService";
import { HttpError } from "@/lib/http";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export function useRoles() {
  const {
    data: roles,
    error,
    isLoading,
    mutate,
  } = useSWR<Role[]>(`${BASE_URL}/api/access/roles`, () => rolesService.getAll(), {
    revalidateOnFocus: false,
  });

  async function createRole(payload: { name: string; description?: string }) {
    try {
      const newRole = await rolesService.create(payload);
      mutate((prev) => (prev ? [...prev, newRole] : [newRole]), false);
      return newRole;
    } catch (err) {
      throw new HttpError("Erro ao criar role", 400);
    }
  }

  async function updateRole(id: string, updates: Partial<Role>) {
    try {
      const updated = await rolesService.update(id, updates);
      mutate(
        (prev) =>
          prev?.map((r) => (r.id === id ? { ...r, ...updated } : r)) || [],
        false
      );
      return updated;
    } catch (err) {
      throw new HttpError("Erro ao atualizar role", 400);
    }
  }

  async function deleteRole(id: string) {
    try {
      await rolesService.remove(id);
      mutate((prev) => prev?.filter((r) => r.id !== id) || [], false);
    } catch (err) {
      throw new HttpError("Erro ao excluir role", 400);
    }
  }

  return {
    roles,
    isLoading,
    isError: Boolean(error),
    createRole,
    updateRole,
    deleteRole,
    refresh: mutate,
  };
}
