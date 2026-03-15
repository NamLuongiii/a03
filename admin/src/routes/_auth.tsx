import {createFileRoute, Outlet} from '@tanstack/react-router'
import {Sidebar} from '../components/Sidebar'
import {cn} from "../ultis/cn.ts"

export const Route = createFileRoute('/_auth')({
    // Logic check auth có thể mở lại khi bạn đã xong phần Login
    // beforeLoad: ({ context }) => {
    //     if (!context.auth?.isAuthenticated) {
    //         throw redirect({ to: '/login' })
    //     }
    // },
    component: AuthLayout,
})

function AuthLayout() {
    return (
        <div className="flex min-h-screen bg-slate-50/50 font-sans">
            {/* 1. Sidebar (Đã có logic Responsive bên trong) */}
            <Sidebar/>

            {/* 2. Vùng Content chính */}
            <main className={cn(
                "flex-1 w-full min-h-screen transition-all duration-300 ease-in-out",
                // Trên Desktop (lg): Chừa khoảng trống 64 đơn vị (256px) cho Sidebar cố định
                "lg:ml-64",
                // Trên Mobile: Chừa khoảng trống 16 đơn vị (64px) cho Top Header đã làm ở Sidebar
                "pt-16 lg:pt-0"
            )}>
                {/* Container nội dung:
                   - p-4 cho mobile để tiết kiệm diện tích
                   - p-8 cho desktop để thoáng đãng chuẩn Bento
                */}
                <div className="p-4 md:p-8 max-w-[1600px] mx-auto">

                    {/* Render các trang con (Books, Dashboard, etc.) */}
                    <section className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                        <Outlet/>
                    </section>
                </div>

                {/* Footer nhẹ nhàng chuẩn Admin Panel (Tùy chọn) */}
                <footer
                    className="py-6 px-8 text-center text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                    &copy; 2026 Trang quản lý <a href="docluon.com" target='_blank'>Docluon.com</a>
                </footer>
            </main>
        </div>
    )
}