import {useRouter} from '@tanstack/react-router';
import {ChevronLeft} from 'lucide-react';
import {cn} from "../ultis/cn.ts";
import {Button} from "@heroui/react";

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
        <div
            className={cn("flex items-center justify-between mb-8 animate-in fade-in slide-in-from-left-2", className)}>
            <div className="flex items-center gap-4">
                {/* Nút Back - Chỉ hiện nếu showBack = true */}
                {showBack && (
                    <Button
                        isIconOnly
                        size={'lg'}
                        variant='tertiary'
                        onClick={() => router.history.back()}
                    >
                        <ChevronLeft/>
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