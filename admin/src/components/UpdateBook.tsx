import {useMutation, useQuery} from "@tanstack/react-query";
import {getBooksCategoriesOptions, type ModelsBook, type PutBooksByIdData, putBooksByIdMutation} from "@/api";
import {Button} from "@components/ui/Button.tsx";
import {Controller, useForm} from "react-hook-form";
import {type JSX, useMemo} from "react";
import {Input} from "@components/ui/Input.tsx";
import {Select} from "@components/ui/Select.tsx";
import {CoverInput} from "@components/CoverInput.tsx";
import {alerts} from "@/ultis/confirm.tsx";
import {FileItem} from "@components/ui/FileItem.tsx";
import {MultiFileInput} from "@components/ui/MultifileInput.tsx";
import {useNavigate} from "@tanstack/react-router";
import {AuthorSelect} from "@components/AuthorSelect.tsx";

type Props = {
    id: string;
    book: ModelsBook;
}

type TForm = NonNullable<PutBooksByIdData['body']>

export function UpdateBook({id, book}: Props): JSX.Element {
    const {mutateAsync, isPending} = useMutation(putBooksByIdMutation());
    const navigate = useNavigate()

    const {register, handleSubmit, control, watch, setValue} = useForm<TForm>({
        defaultValues: {
            name: book.name,
            description: book.description,
            summary: book.summary,
            category_id: book.category_id,
            author_id: book.author_id,
            remove_file_ids: []
        }
    });

    // Theo dõi danh sách ID cần xóa để ẩn file trên UI tạm thời
    // eslint-disable-next-line react-hooks/incompatible-library
    const removeFileIds = watch('remove_file_ids') || [];

    const {data: categoriesRes} = useQuery(getBooksCategoriesOptions());
    const categories = useMemo(() => {
        return (categoriesRes?.data || []).map((item) => ({
            label: item.name || '',
            value: item.id || '',
        }));
    }, [categoriesRes]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            await mutateAsync({body: data, path: {id}});
            alerts.confirmSuccess("Cập nhật thành công", "Thông tin sách đã được thay đổi.");

            navigate({ to: `/books`}).then(

            )

        } catch (error) {
            console.error("Error updating book:", error);
            // Error đã được handle bởi interceptor hoặc hiển thị tại đây
        }
    });

    const handleMarkForDelete = (fileId: number) => {
        setValue('remove_file_ids', [...removeFileIds, fileId]);
    };

    return (
        <form className="space-y-8 mt-6 pb-24" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Cột 1: Cover & Old Files */}
                <Controller
                    name="cover"
                    control={control}
                    render={({field}) => (
                        <CoverInput
                            value={field.value as File}
                            initialUrl={book.cover?.sm}
                            onChange={field.onChange}
                        />
                    )}
                />


                {/* Cột 2 & 3: Info */}
                <div className="md:col-span-4 space-y-6">
                    <Input label="Tên sách" {...register('name')} />

                    <div className="grid grid-cols-2 gap-4">
                        <Controller
                            name="category_id"
                            control={control}
                            render={({field}) => (
                                <Select<string>
                                    label="Thể loại"
                                    options={categories}
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        <Controller
                            name="author_id"
                            control={control}
                            render={({ field, fieldState }) => (
                                <AuthorSelect
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />
                    </div>

                    <Input label="Mô tả" {...register('description')} />

                    <Input
                        label="Tóm tắt nội dung"
                        isTextarea
                        {...register('summary')}
                    />

                    <div className="pt-4 border-t border-slate-100">
                        <Controller
                            name="files"
                            control={control}
                            render={({field}) => (
                                <MultiFileInput
                                    label="Tải lên file mới"
                                    value={(field.value as File[]) || []}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                            File hiện có
                            ({book.digital_books?.filter(f => !removeFileIds.includes(Number(f.id))).length})
                        </label>
                        <div className="space-y-2">
                            {book.digital_books?.map((file) => {
                                if (removeFileIds.includes(Number(file.id))) return null;
                                return (
                                    <FileItem
                                        key={file.id}
                                        file={file}
                                        onDelete={() => handleMarkForDelete(Number(file.id))}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <footer
                className="p-4 flex justify-end z-10">
                <Button variant="primary" type="submit" isLoading={isPending}>
                    Cập nhật sách
                </Button>
            </footer>
        </form>
    );
}