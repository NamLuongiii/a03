import {useRouter} from '@tanstack/react-router';
import {ChevronLeft} from 'lucide-react';
import {Button} from "./ui/Button";
import {cn} from "../ultis/cn.ts";

interface HeaderProps {
    title: string;
    description?: string;
    showBack?: boolean;
    className?: string;
    rightElement?: React.ReactNode; // Để chèn thêm nút Add, Export nếu cần
}

export function Header({
                           title,
                           description,
                           showBack = true,
                           className,
                           rightElement
                       }: HeaderProps) {
    const router = useRouter();

    return (
        <div className={cn("flex items-center justify-between mb-8 animate-in fade-in slide-in-from-left-2", className)}>
            <div className="flex items-center gap-4">
                {/* Nút Back - Chỉ hiện nếu showBack = true */}
                {showBack && (
                    <Button
                        variant="secondary"
                        size="sm"
                        className="w-10 h-10 !p-0 rounded-xl bg-white border-slate-200 shadow-sm hover:border-primary/30 group"
                        onClick={() => router.history.back()}
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                    </Button>
                )}

                {/* Thông tin trang */}
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold tracking-tight text-main-text leading-none">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-sm text-muted-text mt-1 font-medium">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {/* Vùng bên phải dành cho Action Buttons */}
            {rightElement && (
                <div className="flex items-center gap-3">
                    {rightElement}
                </div>
            )}
        </div>
    );
}