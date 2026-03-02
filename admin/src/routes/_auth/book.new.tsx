import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {Header} from "@components/Header.tsx";
import {useForm} from "react-hook-form";
import {Input} from "@components/ui/Input.tsx";
import {Button} from "@components/ui/Button.tsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getBooksCategoriesOptions, postBooksMutation} from "@/api";
import {alerts} from "@/ultis/confirm.tsx";
import {CoverInput} from "@components/CoverInput.tsx";
import {MultiFileInput} from "@components/ui/MultifileInput.tsx";
import {useMemo} from "react";
import {Select} from "@components/ui/Select.tsx";

export const Route = createFileRoute('/_auth/book/new')({
  component: RouteComponent,
})

type IForm = {
   name: string;
   cover: File;
   description: string;
   summary: string;

}

function RouteComponent() {
  const navigate  = useNavigate()
  const { register, handleSubmit} = useForm<IForm>()

  const { mutateAsync, isPending } = useMutation(postBooksMutation())

  const onSubmit = handleSubmit((data: IForm) => {
    mutateAsync({ body: data }).then((res) => {
      alerts.confirmSuccess(res.message || '', 'Sách đã được thêm vào hệ thống', () => {
        navigate({ to: '/books'})
      })
    })
  })

  const { data: categoriesRes} = useQuery(getBooksCategoriesOptions())
  const categories = useMemo(() => {
    const d=  categoriesRes?.data || []
    return d.map((item) => ({
      label: item.name || '',
      value: item.id || '',
    }))
  }, [categoriesRes])

  return <div>
    <Header title="Thêm sách mới" showBack={true} />
    <form className='space-y-8' onSubmit={onSubmit}>
      <Input label={"Tên sách"} placeholder={'Nhập tên sách'}  {...register('name')} />

      <CoverInput onChange={() => {}} />

      <Input label={"Mô tả"} placeholder={'Nhập mô tả'}  {...register('description')} />

      <Input label={"Lời giới thiệu"} placeholder={'Nhập tóm tắt'} isTextarea {...register('summary')} />

      <Select<string>
          label="Thể loại sách"
          options={categories}
          value={''}
          onChange={() => {}}
          description="Chọn danh mục chính xác để dễ phân loại"
      />

      <MultiFileInput value={[]}  onChange={console.log} />

      <footer className='flex gap-2 py-4'>
        <Button variant='primary' type={"submit"} isLoading={isPending}>Thêm sách</Button>
      </footer>
    </form>
  </div>
}
