import {BookIcon, HomeIcon, LogOutIcon, User2Icon} from 'lucide-react';
import {useAuth} from "@/Auth.tsx";

const navigation = [
    {name: 'Trang chủ', to: '/', icon: HomeIcon},
    {name: 'Sách', to: '/books', icon: BookIcon},
    {name: 'Tác giả', to: '/authors', icon: User2Icon},
];

export function Sidebar() {
    const {logout} = useAuth();

    return (
        <>
            {/* Nút Toggle - Chỉ hiện trên Mobile (< 640px) */}
            <div className="p-2 sm:hidden">
                <button
                    type="button"
                    className="btn btn-text btn-square"
                    aria-controls="default-sidebar"
                    data-overlay="#default-sidebar"
                >
                    <span className="icon-[tabler--menu-2] size-6"></span>
                </button>
            </div>

            <aside
                id="default-sidebar"
                className="overlay drawer drawer-start w-64
                           [--auto-close:sm] [--is-layout-affect:true] [--opened:lg]
                           lg:static lg:flex lg:translate-x-0" // Dùng lg để hiện cố định trên màn hình lớn
                role="dialog"
                tabIndex={-1}
            >
                <div className="drawer-body px-2 py-4">
                    <div className="m-6">
                        <span className="font-black text-xl tracking-tighter text-primary">DOCLUON</span>
                    </div>

                    <ul className="menu p-0">
                        {navigation.map((item) => (
                            <li key={item.name}>
                                <a href={item.to}>
                                    <item.icon/>
                                    {item.name}
                                </a>
                            </li>
                        ))}

                        <li>
                            <a href="#" onClick={logout}>
                                <LogOutIcon/>
                                Đăng xuất
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    );
}