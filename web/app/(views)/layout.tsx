import Navbar from "@/app/components/Navbar";
import SavedBook from "@/app/components/SavedBooks";

export default function ViewsLayout({children}: { children: React.ReactNode }) {
    return (
        <div className="relative flex flex-col min-h-screen">
            <Navbar/>

            {/* Main Container: Flex row trên màn hình lớn (lg), mặc định là flex-col */}
            <main className="grow container mx-auto max-w-7xl px-4 py-4 lg:py-12 flex flex-col lg:flex-row gap-12">

                {/* Content chính: Chiếm hết chỗ trống */}
                <section className="flex-1 min-w-0">
                    {children}
                </section>

                {/* Sidebar bên phải */}
                <aside className="w-full lg:w-80 space-y-6 self-start hidden lg:block">

                    {/* Widget 1: Ví dụ Sách đang đọc */}
                    <SavedBook/>
                </aside>
            </main>

            <footer className="w-full flex flex-col items-center gap-2 py-3 border-t">
                <div className="text-xs lg:text-sm text-default-400 text-center">
                    <p>Toàn bộ sách được sưu tập trên mạng</p>
                    <p>Mọi vấn đề về bản quyền vui lòng liên hệ với chúng tôi qua email</p>
                    <p><i>docluonbook@gmail.com</i></p>
                </div>
                <small className="text-small text-default-400 text-center">
                    © 2026
                </small>
            </footer>
        </div>
    );
}