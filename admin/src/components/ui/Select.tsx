import {
    Description,
    Field,
    Label,
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    Transition
} from '@headlessui/react';
import {Check, ChevronDown} from 'lucide-react';
import {Fragment} from 'react';
import {cn} from "@/ultis/cn.ts";

interface SelectProps<T> {
    label?: string;
    description?: string;
    error?: string;
    options: { label: string; value: T }[];
    value: T;
    onChange: (value: T) => void;
    placeholder?: string;
    className?: string;
}

export function Select<T>({
                              label,
                              description,
                              error,
                              options,
                              value,
                              onChange,
                              placeholder = "Chọn một mục...",
                              className
                          }: SelectProps<T>) {
    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <Field className={cn("flex flex-col gap-1 w-full", className)}>
            {label && (
                <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 ml-1 mb-0.5">
                    {label}
                </Label>
            )}

            <Listbox value={value} onChange={onChange}>
                <div className="relative">
                    <ListboxButton
                        className={cn(
                            "relative w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-left text-sm text-slate-900 transition-all",
                            "focus:outline-none focus:border-slate-400 focus:bg-slate-50/30",
                            error ? "border-red-300 bg-red-50/20" : ""
                        )}
                    >
                        <span className={cn("block truncate", !selectedOption && "text-slate-400")}>
                            {selectedOption ? selectedOption.label : placeholder}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                            <ChevronDown size={16} />
                        </span>
                    </ListboxButton>

                    {/* Dùng Transition để mượt và ổn định hơn */}
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <ListboxOptions
                            className={cn(
                                "absolute z-[110] mt-1 max-h-60 w-full overflow-auto rounded-xl border border-slate-100 bg-white p-1 text-sm shadow-xl focus:outline-none",
                                // Loại bỏ shadow-xl nếu bạn muốn phẳng hoàn toàn, dùng border rõ hơn
                                "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]"
                            )}
                        >
                            {options.map((option, index) => (
                                <ListboxOption
                                    key={index}
                                    value={option.value}
                                    className={({ active, selected }) =>
                                        cn(
                                            "relative cursor-pointer select-none rounded-lg py-2 pl-10 pr-4 transition-colors",
                                            active ? "bg-slate-50 text-slate-900" : "text-slate-700",
                                            selected ? "bg-slate-50/50 font-semibold text-slate-900" : ""
                                        )
                                    }
                                >
                                    {({ selected }) => (
                                        <>
                                            <span className="block truncate">{option.label}</span>
                                            {selected && (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-900">
                                                    <Check size={16} />
                                                </span>
                                            )}
                                        </>
                                    )}
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </Transition>
                </div>
            </Listbox>

            {description && !error && (
                <Description className="text-[11px] text-slate-400 ml-1 italic leading-tight">
                    {description}
                </Description>
            )}

            {error && (
                <p className="text-[11px] font-medium text-red-500 ml-1 mt-0.5">
                    {error}
                </p>
            )}
        </Field>
    );
}