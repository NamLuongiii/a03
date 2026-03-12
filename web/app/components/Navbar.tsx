'use client';
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownPopover, DropdownTrigger, Input,} from "@heroui/react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getBooksCategories, ModelsAccount, ModelsCategory} from "@/app/api";
import {deleteCookie} from "cookies-next";
import {useMe} from "@/app/hooks/useMe";
import Avatar from "boring-avatars";
import {useState} from "react";

// Component cho Desktop
function DesktopNavbar({
                           categories,
                           me,
                           logout
                       }: {
    categories: ModelsCategory[],
    me?: ModelsAccount | null,
    logout: () => void
}) {
    const router = useRouter();
    return (
        <div className="hidden md:flex mx-auto h-16 max-w-7xl items-center justify-between px-4 gap-4 w-full">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold tracking-tighter text-primary shrink-0">
                Đọc Luôn
            </Link>

            {/* Categories + Search */}
            <div className="flex flex-1 items-center max-w-xl gap-2">
                <Dropdown>
                    <Button variant="tertiary">Thể loại</Button>
                    <DropdownPopover>
                        <DropdownMenu
                            aria-label="Categories"
                            className="max-h-[400px] overflow-y-auto"
                        >
                            <DropdownItem key="all" href="/books">
                                Tất cả
                            </DropdownItem>
                            {categories?.map((cat: ModelsCategory) => (
                                <DropdownItem
                                    key={cat.id}
                                    href={`/categories/${cat.id}`}
                                >
                                    {cat.name}
                                </DropdownItem>
                            )) || <DropdownItem>Đang tải...</DropdownItem>}
                        </DropdownMenu>
                    </DropdownPopover>
                </Dropdown>

                <Input
                    fullWidth
                    placeholder="Tìm kiếm sách"
                    type="search"
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            const searchTerm = e.currentTarget.value;
                            if (searchTerm) {
                                router.push(`/books?search=${searchTerm}`);
                            }
                            e.currentTarget.value = '';
                            e.currentTarget.blur()
                        }
                    }}
                />
            </div>

            {/* Avatar / Login */}
            <div className="flex items-center gap-2">
                {me ? (
                    <Dropdown>
                        <DropdownTrigger>
                            <Avatar variant='beam'/>
                        </DropdownTrigger>
                        <DropdownPopover placement='bottom right'>
                            <DropdownMenu aria-label="Profile Actions">
                                <DropdownItem key="profile" href="/profile">Hồ sơ của tôi</DropdownItem>
                                <DropdownItem key="settings">Cài đặt</DropdownItem>
                                <DropdownItem key="logout" onClick={logout}>Đăng xuất</DropdownItem>
                            </DropdownMenu>
                        </DropdownPopover>
                    </Dropdown>
                ) : (
                    <Link href="/login">
                        <Button variant='primary'>Đăng nhập</Button>
                    </Link>
                )}
            </div>
        </div>
    );
}

// Component cho Mobile
function MobileNavbar({
                          categories,
                          me,
                          logout
                      }: {
    categories: ModelsCategory[],
    me?: ModelsAccount | null,
    logout: () => void
}) {
    const router = useRouter();
    const [showSearch, setShowSearch] = useState(false);

    return (
        <div className="md:hidden w-full">
            {/* Top bar */}
            <div className="flex h-16 items-center justify-between px-4 gap-2">
                {/* Logo */}
                <Link href="/" className="text-sm font-bold tracking-tighter text-primary shrink-0">
                    Đọc Luôn
                </Link>

                <div className="flex items-center gap-2">
                    {/* Categories Dropdown */}
                    <Dropdown>
                        <DropdownTrigger render={() =>
                            <Button isIconOnly size='sm' variant='tertiary'>
                                📚
                            </Button>
                        }>
                        </DropdownTrigger>
                        <DropdownPopover>
                            <DropdownMenu
                                aria-label="Categories"
                                className="max-h-[400px] overflow-y-auto"
                            >
                                <DropdownItem key="all" href="/books">
                                    Tất cả
                                </DropdownItem>
                                {categories?.map((cat: ModelsCategory) => (
                                    <DropdownItem
                                        key={cat.id}
                                        href={`/categories/${cat.id}`}
                                    >
                                        {cat.name}
                                    </DropdownItem>
                                )) || <DropdownItem>Đang tải...</DropdownItem>}
                            </DropdownMenu>
                        </DropdownPopover>
                    </Dropdown>

                    {/* Search Icon */}
                    <Button
                        isIconOnly
                        size='sm'
                        variant='tertiary'
                        onClick={() => setShowSearch(!showSearch)}
                    >
                        🔍
                    </Button>

                    {/* Avatar / Login */}
                    {me ? (
                        <Dropdown>
                            <DropdownTrigger>
                                <Avatar variant='beam' size={32}/>
                            </DropdownTrigger>
                            <DropdownPopover placement='bottom right'>
                                <DropdownMenu aria-label="Profile Actions">
                                    <DropdownItem key="profile" href="/profile">Hồ sơ của tôi</DropdownItem>
                                    <DropdownItem key="settings">Cài đặt</DropdownItem>
                                    <DropdownItem key="logout" onClick={logout}>Đăng xuất</DropdownItem>
                                </DropdownMenu>
                            </DropdownPopover>
                        </Dropdown>
                    ) : (
                        <Link href="/login">
                            <Button variant='primary' size='sm'>Đăng nhập</Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Search bar (expandable) */}
            {showSearch && (
                <div className="px-4 pb-3">
                    <Input
                        fullWidth
                        placeholder="Tìm kiếm sách"
                        type="search"
                        autoFocus
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                const searchTerm = e.currentTarget.value;
                                if (searchTerm) {
                                    router.push(`/books?search=${searchTerm}`);
                                }
                                e.currentTarget.value = '';
                                setShowSearch(false);
                            }
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const queryClient = useQueryClient();

    const me = useMe()

    const {data} = useQuery({
        queryKey: ['books-categories'],
        queryFn: () => getBooksCategories(),
    });
    const categories = data?.data?.data || [];

    const authRoutes = ["/login", "/signup", "/forgot-password"];
    if (authRoutes.includes(pathname)) return null;

    const logout = () => {
        deleteCookie('auth_token');
        localStorage.clear();
        queryClient.setQueryData(['me'], null);
        router.push('/');
    }

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-divider bg-background/70 backdrop-blur-md">
            <DesktopNavbar categories={categories} me={me} logout={logout}/>
            <MobileNavbar categories={categories} me={me} logout={logout}/>
        </nav>
    );
}