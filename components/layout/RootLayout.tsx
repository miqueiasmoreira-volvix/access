import { SidebarProvider } from "@/context/SidebarContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            {children}
        </SidebarProvider>
    )
}