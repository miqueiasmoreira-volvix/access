import { PanelRightOpen, PanelRightClose } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

export default function SidebarToggle() {
    const { isSidebarOpen, toggleSidebar } = useSidebar();
    return (
        <button
            onClick={toggleSidebar}
            className="
                flex items-center justify-center
                bg-neutral-800/70 hover:bg-neutral-800/80 dark:bg-neutral-200/80 dark:hover:bg-neutral-300
                border border-neutral-700/50 dark:border-neutral-300 dark:hover:border-neutral-300/0
                text-neutral-400 hover:text-neutral-200 dark:text-neutral-600 dark:hover:text-neutral-800
                rounded-md p-0.5
                cursor-pointer
                w-5 h-5"
        >
            {isSidebarOpen ? <PanelRightOpen size={16}/> : <PanelRightClose size={16}/>}
        </button>
    )
}