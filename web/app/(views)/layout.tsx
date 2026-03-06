import Navbar from "@/app/components/Navbar";

export default function ViewsLayout({children}: { children: React.ReactNode }) {
    return (
        <div className="relative flex flex-col min-h-screen">
            <Navbar/>
            <main className="grow container mx-auto max-w-7xl px-4 py-6">
                {children}
            </main>
            <footer className="w-full flex items-center justify-center py-3 border-t">
                <small className="text-small text-default-400">© 2026 Toàn bộ sách được sưu tập trên không gian
                    mạng</small>
            </footer>
        </div>
    );
}
