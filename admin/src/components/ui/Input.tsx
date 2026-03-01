import React, {forwardRef} from 'react';
import {Description, Field, Input as HeadlessInput, Label} from '@headlessui/react';
import {cn} from "../../ultis/cn.ts";

interface BentoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    description?: string;
    error?: string;
    icon?: React.ElementType;
}

export const Input = forwardRef<HTMLInputElement, BentoInputProps>(
    ({ label, description, error, icon: Icon, className, ...props }, ref) => {
        return (
            <Field className="flex flex-col gap-1.5 w-full">
                {/* Label phong cách Admin: Nhỏ, Đậm, Viết hoa nhẹ */}
                {label && (
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-text ml-1">
                        {label}
                    </Label>
                )}

                <div className="relative group">
                    {/* Icon bổ trợ nếu có */}
                    {Icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none">
                            <Icon size={18} />
                        </div>
                    )}

                    <HeadlessInput
                        {...props}
                        ref={ref}
                        className={cn(
                            // Base style: Bo góc lớn (xl), nền nhạt
                            "block w-full rounded-xl border border-border bg-white py-2.5 text-sm text-main-text transition-all",
                            "placeholder:text-slate-400",
                            // Focus style: Đổ bóng nhẹ và đổi màu viền
                            "focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary",
                            // Trạng thái Error
                            error ? "border-red-500 focus:ring-red-500/10 focus:border-red-500" : "",
                            // Padding left nếu có icon
                            Icon ? "pl-11" : "pl-4",
                            "pr-4",
                            className
                        )}
                    />
                </div>

                {/* Description & Error Message */}
                {description && !error && (
                    <Description className="text-xs text-muted-text ml-1">
                        {description}
                    </Description>
                )}

                {error && (
                    <p className="text-xs font-medium text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                )}
            </Field>
        );
    }
);

Input.displayName = 'Input';