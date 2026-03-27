import {useMutation, useQuery} from "@tanstack/react-query";
import {getBooksCategoriesOptions, type ModelsBook, type PutBooksByIdData, putBooksByIdMutation} from "@/api";
import {Button} from "@components/ui/Button.tsx";
import {Controller, useForm} from "react-hook-form";
import {type JSX, useMemo} from "react";
import {CoverInput} from "@components/CoverInput.tsx";
import {FileItem} from "@components/ui/FileItem.tsx";
import {MultiFileInput} from "@components/ui/MultifileInput.tsx";
import {useNavigate} from "@tanstack/react-router";
import {AuthorSelect} from "@components/AuthorSelect.tsx";
import {useAlerts} from "@/providers/AlertProvider.tsx";
import {getFullURL} from "@/ultis/getFullURL.ts";
import {TitleAndBack} from "@components/ui/TitleAndBack.tsx";

type Props = {
    id: string;
    book: ModelsBook;
}

type TForm = NonNullable<PutBooksByIdData['body']>

export function UpdateBook({id, book}: Props): JSX.Element {
    const alerts = useAlerts()
    const {mutateAsync, isPending} = useMutation(putBooksByIdMutation());
    const navigate = useNavigate()

    const {register, handleSubmit, control, watch, setValue} = useForm<TForm>({
        defaultValues: {
            name: book.name,
            description: book.description,
            summary: book.summary,
            category_id: book.category_id,
            author_id: book.author_id,
            remove_file_ids: [],
            readingFile: undefined,
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
            alerts.success("Cập nhật thành công", "Thông tin sách đã được thay đổi.", () => {
                navigate({to: `/books`}).then()
            });

        } catch (error) {
            console.error("Error updating book:", error);
            // Error đã được handle bởi interceptor hoặc hiển thị tại đây
        }
    });

    const handleMarkForDelete = (fileId: number) => {
        setValue('remove_file_ids', [...removeFileIds, fileId]);
    };

    return (
        <form className="space-y-8" onSubmit={onSubmit}>
            <TitleAndBack title='Cập nhật sách'/>

            <Controller
                name="cover"
                control={control}
                render={({field}) => (
                    <CoverInput
                        value={field.value as File}
                        initialUrl={getFullURL(book.cover?.sm)}
                        onChange={field.onChange}
                    />
                )}
            />

            <div>
                <label className="label-text" htmlFor="labelAndHelperText">Tên sách</label>
                <input type="text" placeholder="Nhập tên" className="input" {...register('name')}/>
                <span className="helper-text">Độ dài 5 - 250 kí tự</span>
            </div>

            <div>
                <label className="label-text" htmlFor="favorite-simpson">Chọn danh mục sách</label>
                <select className="select" {...register('category_id')}>
                    {categories.map(category => <option value={category.value}>{category.label}</option>)}
                </select>
            </div>

            <Controller
                name="author_id"
                control={control}
                render={({field, fieldState}) => (
                    <AuthorSelect
                        value={field.value}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                    />
                )}
            />

            <div>
                <label className="label-text" htmlFor="labelAndHelperText">Tóm tắt sách</label>
                <textarea placeholder="Nhập tóm tắt" className="textarea" {...register('summary')} rows={6}/>
                <span className="helper-text">Độ dài 5 - 500 kí tự</span>
            </div>

            <div>
                <label className="label-text" htmlFor="labelAndHelperText">Giới thiệu sách</label>
                <textarea placeholder="Nhập" className="textarea" {...register('description')} rows={6}/>
                <span className="helper-text">Độ dài 5 - 2000 kí tự</span>
            </div>

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

            <div>
                <div>Chức năng đọc sách online</div>

                <div>
                    {book.unzip_root_url ? (<span>Sách này đã hỗ trợ đọc Online</span>) : (
                        <span>Sách này chưa hỗ trợ đọc Online</span>)}
                </div>

                <Controller
                    control={control}
                    render={({field}) => (
                        <input
                            type='file'
                            className='input'
                            aria-label="file-input"
                            placeholder='Tải file epub lên để đọc Online'
                            onChange={(e) => {
                                const files = e.target.files
                                if (files && files.length > 0) {
                                    field.onChange(files[0])
                                }
                            }}/>
                    )}
                    name={'readingFile'}
                />
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