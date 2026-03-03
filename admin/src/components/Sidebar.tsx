import {Link} from '@tanstack/react-router';
import {Dialog, DialogPanel, Menu, MenuButton, MenuItem, MenuItems, Transition} from '@headlessui/react';
import {BookOpen, ChevronUp, Library, LogOut, Menu as MenuIcon, Settings, User, X} from 'lucide-react';
import {cn} from "../ultis/cn.ts";
import {Fragment, useState} from "react";

const navigation = [
    { name: 'Dashboard', to: '/', icon: BookOpen },
    { name: 'Books', to: '/books', icon: Library },
];

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    // Component nội dung Sidebar để dùng chung cho cả Desktop và Mobile
    const SidebarContent = (
        <div className="flex flex-col h-full bg-white p-4 border-r border-border">
            {/* Logo Section */}
            <div className="flex items-center justify-between mb-10 mt-2 px-2">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
                        <BookOpen size={18} strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-900">
                        book<span className="text-blue-600">on</span>
                    </span>
                </div>
                {/* Nút đóng chỉ hiện trên Mobile */}
                <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-900">
                    <X size={20} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        to={item.to}
                        onClick={() => setIsOpen(false)} // Đóng khi click link trên mobile
                        activeProps={{ className: 'bg-slate-50 text-blue-600' }}
                        inactiveProps={{ className: 'text-slate-500 hover:bg-slate-50 hover:text-slate-900' }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                    >
                        <item.icon size={20} />
                        {item.name}
                    </Link>
                ))}
            </nav>

            {/* User Menu */}
            <div className="pt-4 border-t border-slate-100">
                <Menu as="div" className="relative">
                    <MenuButton className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors focus:outline-none text-left">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 shrink-0">
                            <User size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">Admin User</p>
                            <p className="text-xs text-slate-400 truncate">admin@bookon.com</p>
                        </div>
                        <ChevronUp size={16} className="text-slate-400" />
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
                        <MenuItems className="absolute bottom-full left-0 w-full mb-2 bg-white border border-border rounded-2xl shadow-xl p-1.5 focus:outline-none z-50">
                            <MenuItem>
                                {({ focus }) => (
                                    <button className={cn("w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors", focus ? "bg-slate-50 text-slate-900" : "text-slate-500")}>
                                        <Settings size={16} /> Hồ sơ
                                    </button>
                                )}
                            </MenuItem>
                            <MenuItem>
                                {({ focus }) => (
                                    <button className={cn("w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors", focus ? "bg-red-50 text-red-600" : "text-red-500")}>
                                        <LogOut size={16} /> Đăng xuất
                                    </button>
                                )}
                            </MenuItem>
                        </MenuItems>
                    </Transition>
                </Menu>
            </div>
        </div>
    );

    return (
        <>
            {/* 1. Nút Hamburger - Chỉ hiện trên màn nhỏ (< 1024px) */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-border flex items-center px-4 z-40">
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                    <MenuIcon size={24} />
                </button>
                <span className="ml-3 font-bold text-lg text-slate-900">bookon</span>
            </div>

            {/* 2. Sidebar Desktop - Hiện từ 1024px trở lên */}
            <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 z-50">
                {SidebarContent}
            </aside>

            {/* 3. Sidebar Mobile (Drawer) */}
            <Transition show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[60] lg:hidden" onClose={setIsOpen}>
                    {/* Overlay mờ nền */}
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <DialogPanel className="relative w-full max-w-xs flex-1">
                                {SidebarContent}
                            </DialogPanel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}