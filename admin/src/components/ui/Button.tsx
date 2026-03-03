import React from 'react';
import {Button as HeadlessButton} from '@headlessui/react';
import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {Loader2} from 'lucide-react';

/**
 * Utility để merge class Tailwind sạch sẽ
 */
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface BentoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

export const Button = ({
                           variant = 'secondary',
                           size = 'md',
                           className,
                           isLoading,
                           children,
                           ...props
                       }: BentoButtonProps) => {

    const variants = {
        // Nền tối, chữ trắng hoàn toàn để Icon sáng rõ
        primary: 'bg-slate-900 text-white border-transparent hover:bg-black shadow-sm',
        // Nền trắng, viền mảnh, chữ xám đậm
        secondary: 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900',
        // Trong suốt, viền mảnh, icon/chữ xám
        outline: 'bg-transparent border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900',
        // Không nền, không viền, dùng cho các nút phụ trong Table
        ghost: 'bg-transparent border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100',
        // Biến thể cho nút Xóa
        danger: 'bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white hover:border-transparent',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
        md: 'px-4 py-2 text-sm rounded-xl gap-2',
        lg: 'px-6 py-3 text-base rounded-2xl gap-2.5',
        // Size dành riêng cho các nút icon trong bảng (Edit/Delete)
        icon: 'h-8 w-8 p-0 rounded-lg',
    };

    return (
        <HeadlessButton
            {...props}
            disabled={isLoading || props.disabled}
            className={cn(
                // Base: Flexbox để căn giữa Icon và Text
                'inline-flex items-center justify-center font-semibold transition-all duration-200',
                'active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border outline-none',
                'focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2',
                // Quan trọng: Ép Icon thừa hưởng màu chữ của Button
                '[&>svg]:shrink-0 [&>svg]:text-current',
                variants[variant],
                sizes[size],
                className
            )}
        >
            {isLoading ? (
                <Loader2 className={cn(
                    "animate-spin",
                    size === 'sm' ? "h-3.5 w-3.5" : "h-4 w-4"
                )} />
            ) : (
                children
            )}
        </HeadlessButton>
    );
};

Button.displayName = 'Button';