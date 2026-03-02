import React, {forwardRef} from 'react';
import {Description, Field, Input as HeadlessInput, Label, Textarea} from '@headlessui/react';
import {cn} from "../../ultis/cn.ts";

interface BentoInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label?: string;
    description?: string;
    error?: string;
    icon?: React.ElementType;
    isTextarea?: boolean;
}

export const Input = forwardRef<HTMLInputElement & HTMLTextAreaElement, BentoInputProps>(
    ({ label, description, error, icon: Icon, isTextarea, className, ...props }, ref) => {
        const InputComponent = isTextarea ? Textarea : HeadlessInput;

        return (
            <Field className="flex flex-col gap-1 w-full">
                {label && (
                    <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 ml-1 mb-0.5">
                        {label}
                    </Label>
                )}

                <div className="relative">
                    {Icon && (
                        <div className="absolute left-3.5 top-3 text-slate-400 pointer-events-none group-focus-within:text-slate-600 transition-colors">
                            <Icon size={16} />
                        </div>
                    )}

                    <InputComponent
                        {...(props)}
                        ref={ref}
                        className={cn(
                            // SỬA TẠI ĐÂY: Dùng bg-white để nổi bật trên nền xám/nhạt của App
                            "block w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm text-slate-900 transition-all shadow-none",
                            "placeholder:text-slate-300 focus:outline-none",

                            // Focus: Viền đậm hơn một chút và đổi màu nền cực nhẹ để nhận diện vùng nhập liệu
                            "focus:border-slate-400 focus:bg-slate-50/30",

                            // Trạng thái Error
                            error ? "border-red-300 focus:border-red-400 bg-red-50/20" : "",

                            // Padding
                            Icon ? "pl-10" : "pl-4",
                            "pr-4",
                            isTextarea ? "min-h-[120px] py-3 resize-none" : "",
                            className
                        )}
                    />
                </div>

                {description && !error && (
                    <Description className="text-[11px] text-slate-400 ml-1">
                        {description}
                    </Description>
                )}

                {error && (
                    <p className="text-[11px] font-medium text-red-500 ml-1">
                        {error}
                    </p>
                )}
            </Field>
        );
    }
);

Input.displayName = 'Input';