"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/UI/Input";
import PrimaryButton from "@/components/shared/PrimaryButton";
import OutlineButton from "@/components/shared/OutlineButton";
import { useRoles } from "@/hooks/useRoles";
import { useCompanies } from "@/hooks/useCompanies";

export interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserData) => Promise<void>;
  isAdmin?: boolean;
  defaultCompanyId?: string;
}

export interface CreateUserData {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  company_id: string;
  role_id: string;
}

export function CreateUserModal({
  isOpen,
  onClose,
  onSubmit,
  isAdmin = false,
  defaultCompanyId,
}: CreateUserModalProps) {
  const { roles, isLoading: rolesLoading } = useRoles();
  const { companies, isLoading: companiesLoading } = useCompanies();
  
  const [formData, setFormData] = useState<CreateUserData>({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    company_id: defaultCompanyId || "",
    role_id: "",
  });
  
  // Se não é admin, não pode criar usuário sem company_id
  const canCreateUser = isAdmin || defaultCompanyId;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        company_id: defaultCompanyId || "",
        role_id: "",
      });
    } catch (err: any) {
      setError(err.message || "Erro ao criar usuário");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Novo Usuário
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!canCreateUser && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm text-yellow-600 dark:text-yellow-400">
              Você precisa estar associado a uma empresa para criar usuários.
            </div>
          )}
          
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nome"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
              required
            />
            <Input
              label="Sobrenome"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
              required
            />
          </div>

          <Input
            label="E-mail"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />

          <Input
            label="Telefone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Role
            </label>
            <select
              value={formData.role_id}
              onChange={(e) =>
                setFormData({ ...formData, role_id: e.target.value })
              }
              className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={rolesLoading}
            >
              <option value="">Selecione uma role</option>
              {roles?.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {isAdmin && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Empresa *
              </label>
              <select
                value={formData.company_id}
                onChange={(e) =>
                  setFormData({ ...formData, company_id: e.target.value })
                }
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={companiesLoading}
              >
                <option value="">Selecione uma empresa</option>
                {companies?.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Como SUPER ADMIN, você deve escolher a empresa do novo usuário
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <OutlineButton
              type="button"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </OutlineButton>
            <PrimaryButton
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Criando..." : "Criar Usuário"}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}
