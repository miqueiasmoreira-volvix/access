import RootLayout from "@/components/layout/RootLayout";
import Sidebar from "@/components/layout/Sidebard/Sidebar";
import Header from "@/components/layout/Header/Header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <RootLayout>
            <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950 transition-all duration-300 ease-in-out">
                <Sidebar />
                <main className="flex flex-col w-full h-full">
                    <Header />
                    <div className="p-4 h-full">
                        {children}
                    </div>
                </main>
            </div>
        </RootLayout>
    )
}