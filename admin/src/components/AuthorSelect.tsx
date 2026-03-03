import {Fragment, useState} from 'react';
import {Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Transition} from '@headlessui/react';
import {useQuery} from '@tanstack/react-query';
import {Loader2, Plus, Search, User} from 'lucide-react';
import {AuthorQuickCreateModal} from './AuthorQuickCreateModal';
import {cn} from "@/ultis/cn.ts";
import {getAuthorsOptions} from "@/api";

interface AuthorSelectProps {
    value?: string;
    onChange: (id: string) => void;
    error?: string;
}

export function AuthorSelect({ value, onChange, error }: AuthorSelectProps) {
    const [query, setQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch dữ liệu từ server khi user gõ
    const { data, isLoading } = useQuery({
        ...getAuthorsOptions({ query: { search: query, page: 1, size: 20 } }),
        enabled: query.length > 0 || !!value,
    });

    const authors = data?.data?.items || [];
    const selectedAuthor = authors.find(a => a.id === value);

    return (
        <div className="flex flex-col gap-1 w-full relative">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Tác giả</label>

            <Combobox value={value} onChange={id => {
                if (id) {
                    onChange(id);
                }
            }}>
                <div className="relative">
                    <div className={cn(
                        "relative w-full cursor-default rounded-xl border border-slate-200 bg-white transition-all focus-within:border-slate-400",
                        error && "border-red-300 bg-red-50/20"
                    )}>
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                            <Search size={14} />
                        </div>

                        <ComboboxInput
                            className="w-full border-none py-2.5 pl-10 pr-10 text-sm text-slate-900 focus:ring-0 outline-none bg-transparent"
                            displayValue={() => selectedAuthor?.name || ''}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Tìm theo tên tác giả..."
                        />

                        {isLoading && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <Loader2 size={14} className="animate-spin text-slate-300" />
                            </div>
                        )}
                    </div>

                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0"
                        afterLeave={() => setQuery('')}
                    >
                        <ComboboxOptions className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-slate-100 bg-white p-1 text-sm shadow-xl focus:outline-none">
                            {authors.length > 0 ? (
                                authors.map((author) => (
                                    <ComboboxOption
                                        key={author.id}
                                        value={author.id}
                                        className={({ active }) => cn(
                                            "relative cursor-pointer select-none rounded-lg py-2.5 pl-10 pr-4 transition-colors",
                                            active ? "bg-slate-50 text-slate-900" : "text-slate-600"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                                <User size={12} />
                                            </div>
                                            <span className="truncate">{author.name}</span>
                                        </div>
                                    </ComboboxOption>
                                ))
                            ) : !isLoading && query && (
                                <div className="py-3 px-4 text-slate-400 italic text-xs">Không tìm thấy tác giả nào</div>
                            )}

                            {/* Quick Add Button */}
                            {query.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full flex items-center gap-2 px-3 py-3 text-sm text-blue-600 font-bold hover:bg-blue-50 border-t border-slate-50 transition-colors"
                                >
                                    <Plus size={16} />
                                    <span>Thêm mới tác giả "{query}"</span>
                                </button>
                            )}
                        </ComboboxOptions>
                    </Transition>
                </div>
            </Combobox>

            {error && <p className="text-[10px] text-red-500 font-medium ml-1">{error}</p>}

            <AuthorQuickCreateModal
                isOpen={isModalOpen}
                initialName={query}
                onClose={() => setIsModalOpen(false)}
                onSuccess={(newAuthor) => {
                    onChange(newAuthor.id!);
                }}
            />
        </div>
    );
}