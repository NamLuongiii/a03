import {createFileRoute, Outlet} from '@tanstack/react-router'
import {Sidebar} from '../components/Sidebar'
import {cn} from "../ultis/cn.ts"; // Import component Sidebar đã viết ở bước trước

export const Route = createFileRoute('/_auth')({
    // beforeLoad: ({ context }) => {
    //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //     // @ts-expect-error
    //     if (!context.auth?.isAuthenticated) {
    //         throw redirect({
    //             to: '/login',
    //         })
    //     }
    // },
    component: AuthLayout,
})

function AuthLayout() {
    return (
        <div className="flex min-h-screen bg-main-bg font-sans">
            {/* 1. Sidebar cố định bên trái */}
            <Sidebar />

            {/* 2. Vùng Content bên phải */}
            <main className={cn(
                "flex-1 ml-64 min-h-screen", // ml-64 để bù vào chiều rộng của Sidebar (w-64)
                "transition-all duration-300 ease-in-out"
            )}>
                {/* Container cho nội dung bên trong */}
                <div className="p-8 max-w-[1600px] mx-auto">
                    {/* Header đơn giản cho các màn hình (Tùy chọn) */}
                    {/* <header className="mb-8">
            <h2 className="text-sm font-bold text-muted-text uppercase tracking-widest">
              Bento Cloud / Management
            </h2>
          </header> */}

                    {/* Render các child routes tại đây */}
                    <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <Outlet />
                    </section>
                </div>
            </main>
        </div>
    )
}