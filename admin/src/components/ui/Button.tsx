import {Button as HeadlessButton} from '@headlessui/react';
import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

/** * Utility để merge class Tailwind sạch sẽ
 * Cần cài: npm i clsx tailwind-merge
 */
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface BentoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
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
        primary: 'bg-main-text text-white border-transparent hover:bg-slate-800 shadow-sm',
        secondary: 'bg-card-bg text-main-text border-border hover:bg-slate-50',
        outline: 'bg-transparent border-border text-main-text hover:border-slate-400',
        ghost: 'bg-transparent border-transparent text-muted-text hover:text-main-text hover:bg-slate-100',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs rounded-lg',
        md: 'px-5 py-2.5 text-sm rounded-xl', // Khớp với radius bento
        lg: 'px-6 py-3 text-base rounded-2xl',
    };

    return (
        <HeadlessButton
            {...props}
            disabled={isLoading || props.disabled}
            className={cn(
                'inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                variants[variant],
                sizes[size],
                className
            )}
        >
            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            ) : null}
            {children}
        </HeadlessButton>
    );
};