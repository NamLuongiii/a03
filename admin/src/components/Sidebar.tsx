import {Menu, MenuButton, MenuItem, MenuItems, Transition} from '@headlessui/react';
import {BookOpen, ChevronUp, Library, LogOut, Settings} from 'lucide-react';
import {cn} from "../ultis/cn.ts";
import {Fragment} from "react";
import {useAuth} from "@/Auth.tsx";
import {Link} from "@tanstack/react-router";
import Avatar from "boring-avatars";

const navigation = [
    {name: 'Tổng quan', to: '/', icon: BookOpen},
    {name: 'Sách', to: '/books', icon: Library},
];

export function Sidebar() {
    const {logout, me} = useAuth()

    return (
        <aside className="fixed inset-y-0 left-0 w-64 z-50 flex flex-col bg-white p-4 border-r border-border">
            {/* Logo Section */}
            <div className="flex items-center justify-between mb-10 mt-2 px-2">
                <div className="font-bold text-lg text-slate-900">Trang Quản Lý</div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1" aria-label="Navigation">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                        to={item.to}
                    >
                        <item.icon size={20}/>
                        <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                ))}
            </nav>

            {/* User Menu */}
            <div className="pt-4 border-t border-slate-100">
                <Menu as="div" className="relative">
                    <MenuButton
                        className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors focus:outline-none text-left"
                    >
                        <Avatar/>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{me?.name}</p>
                            <p className="text-xs text-slate-400 truncate">{me?.email}</p>
                        </div>
                        <ChevronUp size={16} className="text-slate-400"/>
                    </MenuButton>

                    <Transition
                        as={Fragment}
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0 -translate-y-2"
                        enterTo="transform scale-100 opacity-100 translate-y-0"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100 translate-y-0"
                        leaveTo="transform scale-95 opacity-0 -translate-y-2"
                    >
                        <MenuItems
                            className="absolute bottom-full left-0 w-full mb-2 bg-white border border-border rounded-2xl shadow-xl p-1.5 focus:outline-none z-50"
                        >
                            <MenuItem>
                                {({focus}) => (
                                    <button
                                        className={cn(
                                            "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                                            focus ? "bg-slate-50 text-slate-900" : "text-slate-500"
                                        )}
                                    >
                                        <Settings size={16}/> Hồ sơ
                                    </button>
                                )}
                            </MenuItem>
                            <MenuItem>
                                {({focus}) => (
                                    <button
                                        className={cn(
                                            "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                                            focus ? "bg-red-50 text-red-600" : "text-red-500"
                                        )}
                                        onClick={logout}
                                    >
                                        <LogOut size={16}/> Đăng xuất
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