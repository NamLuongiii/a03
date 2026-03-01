import {Link, useLocation} from '@tanstack/react-router';
import {Menu, MenuButton, MenuItem, MenuItems, Transition} from '@headlessui/react';
import {BookOpen, ChevronUp, Library, LogOut, Settings, User} from 'lucide-react';
import {cn} from "../ultis/cn.ts";

const navigation = [
    { name: 'Dashboard', to: '/', icon: BookOpen },
    { name: 'Books', to: '/books', icon: Library },
];

export function Sidebar() {
    const location = useLocation();

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-border flex flex-col p-4 z-50">
            {/* Logo Section */}
            <div className="flex items-center gap-3 px-2 mb-10 mt-2">
                <div className="w-8 h-8 bg-main-text text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/10">
                    <BookOpen size={18} strokeWidth={2.5} />
                </div>
                <span className="font-bold text-xl tracking-tight text-main-text">
          book<span className="text-primary">on</span>
        </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        to={item.to}
                        activeProps={{ className: 'bg-slate-50 text-primary shadow-sm' }}
                        inactiveProps={{ className: 'text-muted-text hover:bg-slate-50 hover:text-main-text' }}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                        )}
                    >
                        <item.icon size={20} />
                        {item.name}
                    </Link>
                ))}

                {/* Ví dụ link động cho Book Detail (Nếu đang ở trang đó) */}
                {location.pathname.includes('/book/') && (
                    <div className="pt-4 mt-4 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase px-3 tracking-widest">Đang xem</span>
                        <Link
                            to="/book/$id"
                            params={{ id: 'current' }}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-primary bg-blue-50/50 mt-1"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            Chi tiết sách
                        </Link>
                    </div>
                )}
            </nav>

            {/* User Menu Bottom */}
            <div className="pt-4 border-t border-slate-100">
                <Menu as="div" className="relative">
                    <MenuButton className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors focus:outline-none">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                            <User size={20} />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                            <p className="text-sm font-bold text-main-text truncate">Admin User</p>
                            <p className="text-xs text-muted-text truncate">admin@bookon.com</p>
                        </div>
                        <ChevronUp size={16} className="text-slate-400" />
                    </MenuButton>

                    <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0 -translate-y-2"
                        enterTo="transform scale-100 opacity-100 translate-y-0"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100 translate-y-0"
                        leaveTo="transform scale-95 opacity-0 -translate-y-2"
                    >
                        <MenuItems className="absolute bottom-full left-0 w-full mb-2 bg-white border border-border rounded-2xl shadow-xl p-1.5 focus:outline-none overflow-hidden">
                            <MenuItem>
                                {({ focus }) => (
                                    <button className={cn(
                                        "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                                        focus ? "bg-slate-50 text-main-text" : "text-muted-text"
                                    )}>
                                        <Settings size={16} /> Hồ sơ cá nhân
                                    </button>
                                )}
                            </MenuItem>
                            <div className="h-px bg-slate-100 my-1 mx-1" />
                            <MenuItem>
                                {({ focus }) => (
                                    <button className={cn(
                                        "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                                        focus ? "bg-red-50 text-red-600" : "text-red-500"
                                    )}>
                                        <LogOut size={16} /> Đăng xuất
                                    </button>
                                )}
                            </MenuItem>
                        </MenuItems>
                    </Transition>
                </Menu>
            </div>
        </aside>
    );
}