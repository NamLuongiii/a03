import {Dialog, DialogPanel, DialogTitle, Transition, TransitionChild} from '@headlessui/react';
import {Fragment} from 'react';
import {useForm} from 'react-hook-form';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {type ModelsAuthor, postAuthorsMutation} from '@/api';
import {Input} from './ui/Input';
import {Button} from './ui/Button';
import {X} from 'lucide-react';
import {toast} from 'sonner';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    initialName: string;
    onSuccess: (author: ModelsAuthor) => void;
}

export function AuthorQuickCreateModal({ isOpen, onClose, initialName, onSuccess }: Props) {
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset } = useForm<{ name: string }>({
        values: { name: initialName }
    });

    const { mutate, isPending } = useMutation({
        ...postAuthorsMutation(),
        onSuccess: (res) => {
            toast.success('Đã thêm tác giả mới');
            queryClient.invalidateQueries({ queryKey: ['getAuthors'] });
            if (res.data) onSuccess(res.data);
            reset();
            onClose();
        }
    });

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[100]" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                    leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-6 shadow-2xl transition-all border border-slate-100">
                                <div className="flex justify-between items-center mb-6">
                                    <DialogTitle className="text-lg font-bold text-slate-900">Thêm tác giả mới</DialogTitle>
                                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit((data) => mutate({ body: data }))} className="space-y-4">
                                    <Input label="Tên tác giả" {...register('name', { required: true })} placeholder="Nhập tên đầy đủ..." />

                                    <div className="flex gap-3 pt-4">
                                        <Button variant="secondary" className="flex-1" onClick={onClose} type="button">Hủy</Button>
                                        <Button variant="primary" className="flex-1" type="submit" isLoading={isPending}>Tạo mới</Button>
                                    </div>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}