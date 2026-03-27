import {createFileRoute, Outlet} from '@tanstack/react-router'
import {Sidebar} from '../components/Sidebar'

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
        <div className="flex h-screen overflow-hidden">
            {/* 1. Sidebar (Đã có logic Responsive bên trong) */}
            <Sidebar/>

            {/* 2. Vùng Content chính */}
            <main className="flex flex-col flex-1 min-w-0 overflow-y-auto p-6">
                <Outlet/>

                {/* Footer nhẹ nhàng chuẩn Admin Panel (Tùy chọn) */}
                <footer
                    className="py-6 px-8 text-center text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                    &copy; 2026 Trang quản lý <a href="docluon.com" target='_blank'>Docluon.com</a>
                </footer>
            </main>
        </div>
    )
}