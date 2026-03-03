import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {Header} from "@components/Header.tsx";
import {Controller, useForm} from "react-hook-form";
import {Input} from "@components/ui/Input.tsx";
import {Button} from "@components/ui/Button.tsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getBooksCategoriesOptions, postBooksMutation} from "@/api";
import {CoverInput} from "@components/CoverInput.tsx";
import {useMemo} from "react";
import {Select} from "@components/ui/Select.tsx";
import {alerts} from "@/ultis/confirm.tsx";
import {MultiFileInput} from "@components/ui/MultifileInput.tsx";
import {AuthorSelect} from "@components/AuthorSelect.tsx";

export const Route = createFileRoute('/_auth/book/new')({
    component: RouteComponent,
})

type IForm = {
    name: string;
    cover: File | undefined;
    description: string;
    summary: string;
    category_id: string;
    author_id: string;
    files: File[];
}

function RouteComponent() {
    const navigate = useNavigate()
    const {register, handleSubmit, control} = useForm<IForm>({
        defaultValues: {
            name: '',
            description: '',
            summary: '',
            category_id: '',
            files: [],
            cover: undefined
        }
    })

    const {mutateAsync, isPending} = useMutation(postBooksMutation())

    const onSubmit = handleSubmit(async (data: IForm) => {
        mutateAsync({body: data})
            .then(res => {
                alerts.confirmSuccess(res.message || 'Thành công', 'Sách đã được thêm vào hệ thống', () => {
                    navigate({to: '/books'})
                })
            }).catch(err => {
            console.log(err)
        })

    })

    const {data: categoriesRes} = useQuery(getBooksCategoriesOptions())
    const categories = useMemo(() => {
        const d = categoriesRes?.data || []
        return d.map((item) => ({
            label: item.name || '',
            value: item.id || '',
        }))
    }, [categoriesRes])

    return (
        <div className="mx-auto pb-20">
            <Header title="Thêm sách mới" showBack={true}/>

            <form className='space-y-6 mt-6 px-4' onSubmit={onSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Cột trái: Ảnh bìa */}
                    <div className="md:col-span-1">
                        <Controller
                            name="cover"
                            control={control}
                            render={({field}) => (
                                <CoverInput
                                    value={field.value}
                                    onChange={field.onChange}
                                    maxSize={5}
                                />
                            )}
                        />
                    </div>

                    {/* Cột phải: Thông tin chi tiết */}
                    <div className="md:col-span-2 space-y-6">
                        <Input label="Tên sách" placeholder='Nhập tên sách' {...register('name')} />

                        <div className="grid grid-cols-2 gap-4">
                            <Controller
                                name="category_id"
                                control={control}
                                render={({field}) => (
                                    <Select<string>
                                        label="Thể loại"
                                        options={categories}
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Chọn thể loại"
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
                            />                        </div>

                        <Input label="Mô tả ngắn" placeholder='Nhập mô tả' {...register('description')} />
                    </div>
                </div>

                <Input label="Lời giới thiệu & Tóm tắt" placeholder='Viết gì đó hấp dẫn về cuốn sách...'
                       isTextarea {...register('summary')} />

                <div className="pt-4 border-t border-slate-100">
                    <Controller
                        name="files"
                        control={control}
                        render={({field}) => (
                            <MultiFileInput
                                label="Tài liệu đính kèm"
                                value={field.value}
                                onChange={field.onChange}
                                maxFiles={5}
                            />
                        )}
                    />
                </div>



                <footer
                    className='p-4 flex mx-auto z-10'>
                    <div className="flex gap-3">
                      <Button variant='primary' type="submit" isLoading={isPending} className="min-w-[120px]">
                        Thêm sách
                      </Button>
                        <Button variant='secondary' type="button" onClick={() => navigate({to: '/books'})}>
                            Hủy bỏ
                        </Button>
                    </div>
                </footer>
            </form>
        </div>
    )
}