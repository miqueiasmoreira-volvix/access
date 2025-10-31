export default function Header() {
    return (
        <header className="bg-neutral-100 dark:bg-neutral-950 transition-all duration-300 ease-in-out p-4">
            <div>
                <div className="flex gap-2">
                    <span className="text-neutral-400 dark:text-neutral-500">Syncro</span>
                    <span className="text-neutral-800 dark:text-neutral-200">/ Início</span>
                </div>
                <div>
                    <span className="text-neutral-800 dark:text-neutral-200 font-semibold text-2xl">Dashboard</span>
                </div>
            </div>
        </header>
    )
}