'use client';
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownPopover, DropdownTrigger, Input,} from "@heroui/react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getBooksCategories, ModelsCategory} from "@/app/api";
import {deleteCookie} from "cookies-next";
import {useMe} from "@/app/hooks/useMe";
import Avatar from "boring-avatars";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const queryClient = useQueryClient();

    const me = useMe()

    // 1. Load categories bằng React Query
    const {data} = useQuery({
        queryKey: ['books-categories'],
        queryFn: () => getBooksCategories(),
    });
    const categories = data?.data?.data || [];

    // Ẩn Navbar ở trang Auth
    const authRoutes = ["/login", "/signup", "/forgot-password"];
    if (authRoutes.includes(pathname)) return null;

    const logout = () => {
        // remove cookies
        deleteCookie('auth_token');
        // clear local storage
        localStorage.clear();
        // remove user from global state
        queryClient.setQueryData(['me'], null);
        // go home
        router.push('/');
    }

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-divider bg-background/70 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 gap-4">

                {/* --- 1. LOGO --- */}
                <Link href="/" className="text-xl font-bold tracking-tighter text-primary shrink-0">
                    Đọc Luôn
                </Link>

                {/* --- 2. CATEGORIES + SEARCH (Chỉ hiện trên Desktop) --- */}
                <div className="hidden md:flex flex-1 items-center max-w-xl gap-2">
                    {/* Dropdown Danh mục cạnh Search Box */}
                    <Dropdown>
                        <Button variant="tertiary">Thể loại</Button>
                        <DropdownPopover>
                            <DropdownMenu
                                aria-label="Categories"
                                className="max-h-[400px] overflow-y-auto"
                            >
                                {/*All */}
                                <DropdownItem key="all" href="/books">
                                    Tất cả
                                </DropdownItem>
                                {/* Render danh sách từ API */}
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

                    {/* Ô Search chính */}
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
                                return
                            }
                        }}
                    />
                </div>

                {/* --- 3. AVATAR & MOBILE SEARCH --- */}
                <div className="flex items-center gap-2">
                    {/* Icon Search cho Mobile */}
                    <Button isIconOnly className="md:hidden">
                        🔍
                    </Button>

                    {me ? (
                        <Dropdown>
                            <DropdownTrigger>
                                <Avatar variant='beam'
                                />
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
        </nav>
    );
}