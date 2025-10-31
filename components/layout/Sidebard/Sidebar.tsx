"use client";

import Image from "next/image";
import { useSidebar } from "@/context/SidebarContext";
import SidebarToggle from "./SidebarToggle";
import { ThemeToggleButton } from "@/components/shared/ThemeToggle";
import { Squares2X2Icon, UserCircleIcon, LockClosedIcon, InboxStackIcon, BuildingLibraryIcon, QuestionMarkCircleIcon, Cog6ToothIcon } from "@heroicons/react/16/solid";
import SidebarButton from "@/components/shared/SidebarButton";

export default function Sidebar() {

    const { isSidebarOpen, toggleSidebar } = useSidebar();

    return (
        <aside
            className={`
                relative flex flex-col h-screen p-4
                bg-neutral-100 dark:bg-neutral-950
                border-r border-neutral-800 dark:border-neutral-200
                transition-all duration-300 ease-in-out
                ${isSidebarOpen ? "w-[208px]" : "w-[88px]"}
            `}
        >
            {/* Toggle */}
            <div className="absolute top-6 -right-2 w-5 h-5">
                <SidebarToggle />
            </div>

            {/* Logo */}
            <div className="flex w-full items-center justify-center">
                <div className={`flex w-full items-center h-16 transition-all duration-300 ease-in-out`}>
                    {isSidebarOpen ?
                        <div className="flex gap-2">
                            {/* Ícone sempre visível */}
                            <Image
                                src="/logo/logo.svg"
                                alt="Access Logo"
                                width={32}
                                height={32}
                                className="flex-shrink-0"
                            />

                            {/* Contêiner para o texto com transição */}
                            <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? "max-w-xs" : "max-w-0"}`}>
                                <span className="whitespace-nowrap text-3xl font-bold text-blue-800">
                                    Acess
                                </span>
                            </div>
                        </div>
                        :
                        <div className="flex gap-2">
                            {/* Ícone sempre visível */}
                            <Image
                                src="/logo/logo.svg"
                                alt="Access Logo"
                                width={32}
                                height={32}
                                className="flex-shrink-0"
                            />
                        </div>
                    }
                </div>
            </div>

            {/* Nav && Footer */}
            <div className="mt-4 flex flex-1 flex-col">
                <span className="text-sm font-semibold text-neutral-500">MENU</span>
                <div className="flex h-full w-full flex-col justify-between">
                    <nav className="mt-4 flex h-fit w-full flex-col gap-2">
                        <SidebarButton
                            size="sm"
                            href="/app/dashboard"
                            icon={<Squares2X2Icon className="w-4 h-4" />}
                            isCollapsed={!isSidebarOpen}
                            ariaLabel="Dashboard"
                        >
                            Dashboard
                        </SidebarButton>
                        <SidebarButton
                            size="sm"
                            href="/app/users-management"
                            icon={<UserCircleIcon className="w-4 h-4" />}
                            isCollapsed={!isSidebarOpen}
                            ariaLabel="Usuários"
                        >
                            Usuários
                        </SidebarButton>
                        <SidebarButton
                            size="sm"
                            href="/app/roles-management"
                            icon={<LockClosedIcon className="w-4 h-4" />}
                            isCollapsed={!isSidebarOpen}
                            ariaLabel="Permissões"
                        >
                            Permissões
                        </SidebarButton>
                        <SidebarButton
                            size="sm"
                            href="/app/workspaces-management"
                            icon={<InboxStackIcon className="w-4 h-4" />}
                            isCollapsed={!isSidebarOpen}
                            ariaLabel="Workspaces"
                        >
                            Workspaces
                        </SidebarButton>
                        <SidebarButton
                            size="sm"
                            href="/app/organization-management"
                            icon={<BuildingLibraryIcon className="w-4 h-4" />}
                            isCollapsed={!isSidebarOpen}
                            ariaLabel="Organização"
                        >
                            Organização
                        </SidebarButton>

                        
                    </nav>
                    <footer className="h-fit w-full">
                        <ThemeToggleButton
                            isCollapsed={!isSidebarOpen}
                        />
                        <SidebarButton
                            size="sm"
                            href="/app/help"
                            icon={<QuestionMarkCircleIcon className="w-4 h-4" />}
                            isCollapsed={!isSidebarOpen}
                            ariaLabel="Ajuda"
                        >
                            <span>Ajuda</span>
                        </SidebarButton>
                        <SidebarButton
                            size="sm"
                            href="/app/settings"
                            icon={<Cog6ToothIcon className="w-4 h-4" />}
                            isCollapsed={!isSidebarOpen}
                            ariaLabel="Configurações"
                        >
                            <span>Configurações</span>
                        </SidebarButton>
                    </footer>
                </div>
            </div>
        </aside>
    )
}
