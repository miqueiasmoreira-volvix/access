'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { SlidersHorizontal, Plus, MoreVertical, User, Trash2, ChevronDown } from 'lucide-react';
import PrimaryButton from '@/components/shared/PrimaryButton';
import OutlineButton from '@/components/shared/OutlineButton';
import GhostButton from '@/components/shared/GhostButton';
import IconButton from '@/components/shared/IconButton';
import PaginationButton from '@/components/shared/PaginationButton';
import { SearchInput } from '@/components/shared/SearchInput';
import { CountBadge } from '@/components/shared/CountBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TableCheckbox } from '@/components/shared/TableCheckbox';
import { ActionMenu } from '@/components/shared/ActionMenu';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/UI/Table';
import { useUsers } from '@/hooks/useUsers';
import { mapUsersToUI, UserUI } from '@/lib/mappers/userMapper';
import { CreateUserModal, CreateUserData } from '@/components/modals/CreateUserModal';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

// TODO: Pegar do contexto de autenticação
// Se company_id for null, o usuário é SUPER ADMIN (acesso global)
const CURRENT_USER_COMPANY_ID = null; // ou pegar da sessão
const CURRENT_USER_ROLE = 'ADMIN'; // TODO: Pegar da sessão
const IS_SUPER_ADMIN = CURRENT_USER_ROLE === 'ADMIN' && CURRENT_USER_COMPANY_ID === null;

export default function UsersManagement() {
  const router = useRouter();
  const { users, isLoading, createUser, deleteUser } = useUsers();
  
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'lastActive' | 'dateAdded'>('lastActive');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Mapeia users da API para UserUI
  const usersUI = useMemo(() => {
    if (!users) return [];
    return mapUsersToUI(users);
  }, [users]);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleAllUsers = () => {
    if (selectedUsers.length === usersUI.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(usersUI.map(u => u.id));
    }
  };

  const handleCreateUser = async (data: CreateUserData) => {
    await createUser(data);
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      await deleteUser(userId);
    }
  };

  const handleViewProfile = (userId: string) => {
    router.push(`/app/users-management/${userId}`);
  };

  // Filtros client-side
  const filteredUsers = useMemo(() => {
    return usersUI.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [usersUI, searchQuery]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <LoadingSpinner size="lg" />
        <div className="text-neutral-600 dark:text-neutral-400">Carregando usuários...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              All users
            </h2>
            <CountBadge count={usersUI.length} />
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />

            {/* Filters Button */}
            <OutlineButton icon={<SlidersHorizontal className="w-4 h-4" />}>
              Filters
            </OutlineButton>

            {/* Add User Button */}
            <PrimaryButton 
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Add user
            </PrimaryButton>
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow hoverable={false}>
              <TableHead className="w-12">
                <TableCheckbox
                  checked={selectedUsers.length === usersUI.length && usersUI.length > 0}
                  onChange={toggleAllUsers}
                  aria-label="Select all users"
                />
              </TableHead>
              <TableHead>User name</TableHead>
              <TableHead>Access</TableHead>
              <TableHead>
                <GhostButton
                  onClick={() => {
                    if (sortBy === 'lastActive') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('lastActive');
                      setSortOrder('desc');
                    }
                  }}
                  icon={<ChevronDown className="w-3 h-3" />}
                  className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider p-0 h-auto"
                >
                  Last active
                </GhostButton>
              </TableHead>
              <TableHead>Date added</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <TableCheckbox
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                    aria-label={`Select ${user.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {user.name}
                      </div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {user.access.map((permission, idx) => (
                      <StatusBadge
                        key={idx}
                        status={
                          permission === 'Admin'
                            ? 'admin'
                            : permission === 'Data Export'
                            ? 'info'
                            : 'neutral'
                        }
                      >
                        {permission}
                      </StatusBadge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{user.lastActive}</TableCell>
                <TableCell>{user.dateAdded}</TableCell>
                <TableCell className="relative">
                  <ActionMenu
                    trigger={
                      <IconButton
                        icon={<MoreVertical className="w-5 h-5" />}
                      />
                    }
                    align="right"
                    open={openMenuId === user.id}
                    onOpenChange={(open) => setOpenMenuId(open ? user.id : null)}
                    items={[
                      {
                        label: 'View profile',
                        icon: <User className="w-4 h-4" />,
                        onClick: () => handleViewProfile(user.id),
                      },
                      {
                        label: 'Delete user',
                        icon: <Trash2 className="w-4 h-4" />,
                        variant: 'danger' as const,
                        separator: true,
                        onClick: () => handleDeleteUser(user.id),
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-1 mt-6">
          {[1, 2, 3, 4, 5, 6].map((page) => (
            <PaginationButton
              key={page}
              isActive={page === 1}
            >
              {page}
            </PaginationButton>
          ))}
        </div>

        {/* Create User Modal */}
        <CreateUserModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateUser}
          isAdmin={IS_SUPER_ADMIN}
          defaultCompanyId={CURRENT_USER_COMPANY_ID || undefined}
        />
      </div>
    </div>
  );
}