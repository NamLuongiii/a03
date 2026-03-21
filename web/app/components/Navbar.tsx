'use client';
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownPopover, DropdownTrigger, Modal,} from "@heroui/react";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getBooksCategories, ModelsAccount, ModelsCategory} from "@/app/api";
import {deleteCookie} from "cookies-next";
import {useMe} from "@/app/hooks/useMe";
import Avatar from "boring-avatars";
import {useState} from "react";
import {LogOutIcon, MenuIcon, SearchIcon, UserIcon} from "lucide-react";
import MobileOverlay from "@/app/components/ui/MobileOverlay";
import Search from "@/app/components/Search";

type Props = {
    categories: ModelsCategory[],
    me?: ModelsAccount | null,
    logout: () => void
}

// Component cho Desktop
function DesktopNavbar({categories, me, logout}: Props) {
    const [open, setOpen] = useState(false);

    return (
        <div className="hidden md:flex mx-auto h-16 max-w-7xl items-center justify-between px-4 gap-4 w-full">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold tracking-tighter text-primary shrink-0">
                Đọc Luôn
            </Link>

            {/* Categories + Search */}
            <Dropdown>
                <Button variant="tertiary" className='ml-auto'>Thể loại</Button>
                <DropdownPopover>
                    <DropdownMenu
                        aria-label="Categories"
                        className="max-h-100 overflow-y-auto"
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

            <Button isIconOnly variant="tertiary" onClick={() => setOpen(true)}>
                <SearchIcon/>
            </Button>

            <Modal isOpen={open} onOpenChange={setOpen}>
                <Modal.Backdrop>
                    <Modal.Container placement='top'>
                        <Modal.Dialog>
                            <Modal.CloseTrigger/>
                            <Modal.Header>
                                <Modal.Heading>Tìm kiếm</Modal.Heading>
                            </Modal.Header>
                            <Modal.Body>
                                <Search onClose={() => setOpen(false)}/>
                            </Modal.Body>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>

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
                                <DropdownItem key="logout" onClick={logout}>Đăng xuất</DropdownItem>
                            </DropdownMenu>
                        </DropdownPopover>
                    </Dropdown>
                ) : (
                    <Link href="/login">
                        <Button isIconOnly variant='primary'>
                            <UserIcon/>
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}

// Component cho Mobile
function MobileNavbar({categories, me, logout}: Props) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);

    const selectCate = (cate: ModelsCategory) => {
        router.push(`/categories/${cate.id}`)
        setOpen(false);
    }

    return (
        <div className="md:hidden flex items-center px-4 p-2 gap-1">
            {/* Logo */}
            <Link href="/" className="text-sm font-bold tracking-tighter"
                  onClick={() => selectCate({id: '/books',})}>
                Đọc Luôn
            </Link>

            {me ? <Link href='/profile' className='block ml-auto'>
                <Button variant='tertiary' size='sm' className='text-xs' type='button'>Sách của tôi</Button>
            </Link> : null}

            {/* Search Icon */}
            <Button
                isIconOnly
                variant='ghost'
                size='sm'
                onClick={() => setOpenSearch(true)}
            >
                <SearchIcon/>
            </Button>

            <Button isIconOnly variant='ghost'
                    size='sm'
                    onClick={() => setOpen(true)}>
                <MenuIcon/>
            </Button>

            {/* Avatar / Login */}
            {me ? (
                <Avatar variant='beam' size={24} onClick={() => setOpenMenu(true)}/>
            ) : (
                <Link href="/login">
                    <Button isIconOnly variant='ghost'>
                        <UserIcon/>
                    </Button>
                </Link>
            )}

            <MobileOverlay isOpen={open} onClose={() => setOpen(false)}>
                <div className='flex flex-col gap-4'>
                    <div className='text-lg font-semibold'>Thể loại</div>
                    <Link
                        href='/books'
                        className='text-lg'
                        onClick={() => setOpen(false)}>
                        Tất cả
                    </Link>
                    {categories.map(cate => (
                        <div
                            key={cate.id}
                            aria-label={cate.name}
                            onClick={() => selectCate(cate)}
                            className='text-lg'
                        >
                            {cate.name}
                        </div>
                    ))}
                </div>
            </MobileOverlay>

            <MobileOverlay isOpen={openMenu} onClose={() => setOpenMenu(false)}>
                <div className='flex flex-col gap-4 h-full'>
                    <div className="text-lg font-semibold">Chức năng</div>
                    <Link href="/profile">
                        <Button variant='ghost' type='button'>
                            <UserIcon/>
                            Tài khoản
                        </Button>
                    </Link>
                    <Button variant='ghost' type='button' onClick={() => {
                        logout();
                        setOpenMenu(false);
                    }}>
                        <LogOutIcon/>
                        Đăng xuất
                    </Button>
                </div>
            </MobileOverlay>

            <MobileOverlay isOpen={openSearch} onClose={() => setOpenSearch(false)}>
                <div className='text-lg font-semibold'>Tìm kiếm</div>
                <Search onClose={() => setOpenSearch(false)}/>
            </MobileOverlay>
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

