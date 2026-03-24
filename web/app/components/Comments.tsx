'use client'

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getBooksByIdComments, ModelsComment, postBooksByIdComments, postBooksByIdView} from "@/app/api";
import {Button, Input, Spinner, TextArea, toast} from "@heroui/react";
import Avatar from "boring-avatars";
import {formatDistanceToNow} from "date-fns";
import {vi} from "date-fns/locale";
import {useForm} from "react-hook-form";
import {useMe} from "@/app/hooks/useMe";
import {useEffect} from "react";

type TForm = { title: string; text: string; }

export const Comments = ({bookID}: { bookID: string }) => {
    const me = useMe();
    const queryClient = useQueryClient();
    const {register, handleSubmit, reset} = useForm<TForm>();

    useEffect(() => {
        if (!bookID) return;
        postBooksByIdView({path: {id: bookID}})
    }, [bookID])

    const {data: cmts, isLoading} = useQuery({
        queryKey: ['comments', bookID],
        queryFn: async () => {
            const res = await getBooksByIdComments({path: {id: bookID}});
            return res.data?.data as ModelsComment[];
        }
    });

    const {mutate, isPending} = useMutation({
        mutationFn: (data: TForm) => postBooksByIdComments({path: {id: bookID}, body: data as never}),
        onSuccess: (res) => {
            const newCmt = res.data?.data as ModelsComment;
            queryClient.setQueryData(['comments', bookID], (old: ModelsComment[] | undefined) =>
                old ? [newCmt, ...old] : [newCmt]
            );
            toast.success('Đã gửi bình luận');
            reset();
        }
    });

    if (isLoading) return <div className="flex justify-center py-20"><Spinner color="current"/></div>;

    return (
        <div className="flex flex-col gap-12">
            {/* Tiêu đề & Form */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                    <h3>Bình luận</h3>
                    <p>Chia sẻ cảm nhận của bạn về tác phẩm này.</p>
                </div>

                {me ? (
                    <form onSubmit={handleSubmit((d) => mutate(d))} className="flex flex-col gap-3">
                        <Input
                            {...register('title', {required: true})}
                            placeholder="Tiêu đề..."
                        />
                        <TextArea
                            {...register('text', {required: true})}
                            placeholder="Viết nội dung bình luận tại đây..."
                        />
                        <div className="flex justify-end">
                            <Button
                                isPending={isPending}
                                type="submit"
                                variant='tertiary'
                            >
                                GỬI
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="py-8 border border-dashed border-divider flex justify-center">
                        <span
                            className="text-sm uppercase tracking-tight text-default-500">Đăng nhập để bình luận</span>
                    </div>
                )}
            </div>

            {/* Danh sách bình luận */}
            <div className="flex flex-col gap-8">
                {cmts?.map((cmt, index) => (
                    <div key={index} className="flex gap-4">
                        <div className="flex-none pt-1">
                            <Avatar size={32} name={cmt.account?.name} variant="bauhaus"/>
                        </div>

                        <div className="flex flex-col gap-2 flex-1">
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm font-bold uppercase tracking-tight">{cmt.account?.name}</span>
                                <span className="text-[10px] text-default-400 uppercase">
                                    {cmt.created_at && formatDistanceToNow(new Date(cmt.created_at), {
                                        locale: vi,
                                        addSuffix: true
                                    })}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <h4 className="text-sm font-semibold">{cmt.title}</h4>
                                <p className="text-sm text-default-600 leading-relaxed">{cmt.content}</p>
                            </div>
                        </div>
                    </div>
                ))}

                {cmts?.length === 0 && (
                    <div className="py-10 text-center text-default-300 uppercase text-xs tracking-[0.2em]">
                        Chưa có bình luận nào
                    </div>
                )}
            </div>
        </div>
    );
};