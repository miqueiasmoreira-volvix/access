"use client";
import useSWR from "swr";
import { companiesService, Company } from "@/services/access/companies/companiesService";
import { HttpError } from "@/lib/http";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export function useCompanies() {
  const {
    data: companies,
    error,
    isLoading,
    mutate,
  } = useSWR<Company[]>(`${BASE_URL}/api/access/companies`, () => companiesService.getAll(), {
    revalidateOnFocus: false,
  });

  async function createCompany(name: string) {
    try {
      const newCompany = await companiesService.create(name);
      mutate((prev) => (prev ? [...prev, newCompany] : [newCompany]), false);
      return newCompany;
    } catch (err) {
      throw new HttpError("Erro ao criar empresa", 400);
    }
  }

  async function updateCompany(id: string, updates: { name?: string; renew_code?: boolean }) {
    try {
      const updated = await companiesService.update(id, updates);
      mutate(
        (prev) =>
          prev?.map((c) => (c.id === id ? { ...c, ...updated } : c)) || [],
        false
      );
      return updated;
    } catch (err) {
      throw new HttpError("Erro ao atualizar empresa", 400);
    }
  }

  async function deleteCompany(id: string) {
    try {
      await companiesService.remove(id);
      mutate((prev) => prev?.filter((c) => c.id !== id) || [], false);
    } catch (err) {
      throw new HttpError("Erro ao excluir empresa", 400);
    }
  }

  return {
    companies,
    isLoading,
    isError: Boolean(error),
    createCompany,
    updateCompany,
    deleteCompany,
    refresh: mutate,
  };
}
