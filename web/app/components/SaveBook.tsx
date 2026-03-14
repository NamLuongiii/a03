'use client'

import {Button, toast} from "@heroui/react";
import {HeartIcon} from "lucide-react";
import {useEffect, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {deleteUserBooksByBookId, getUserBooksByBookId, ModelsUserBook, postUserBooks} from "@/app/api";
import {useMe} from "@/app/hooks/useMe";

type Props = {
    book_id: string
}

export default function SaveBook({book_id}: Props) {
    const [isSaved, setIsSaved] = useState(false)
    const queryClient = useQueryClient()
    const me = useMe()

    const {data, isLoading} = useQuery({
        queryKey: ['get-user-book-by-id', book_id],
        queryFn: async () => getUserBooksByBookId({path: {bookID: book_id}}),
    })

    useEffect(() => {
        if (data) {
            const ub = data.data?.data as ModelsUserBook
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (ub) setIsSaved(true)
        }
    }, [data])

    const {mutateAsync, isPending: isAdding} = useMutation({
        mutationKey: ['save-book-to-user', book_id],
        mutationFn: (data: { book_id: string }) => postUserBooks({body: data}),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['get-user-books', me?.id]})
        }
    })

    const {mutateAsync: removeBook, isPending: isRemoving} = useMutation({
        mutationKey: ['remove-book-from-user', book_id],
        mutationFn: (book_id: string) => deleteUserBooksByBookId({path: {book_id}}),
        onSuccess: () => {

            queryClient.setQueryData(['get-user-books', me?.id], (oldData: ModelsUserBook[]) => {
                if (!oldData) return [];
                return oldData.filter((item: ModelsUserBook) => item.book_id !== book_id);
            });
        }
    });


    const saveBook = async () => {
        await mutateAsync({book_id})
        setIsSaved(true)
        toast.success('Lưu sách thành công')
    }

    const removeBookFromUser = async () => {
        await removeBook(book_id)
        setIsSaved(false)
        toast.success('Xóa sách thành công')
    }

    const handleClick = async () => {
        if (isSaved) {
            await removeBookFromUser()
        } else {
            await saveBook()
        }
    }

    return (
        <Button
            isPending={isAdding || isRemoving || isLoading}
            isIconOnly={true}
            variant='tertiary'
            isDisabled={isAdding || isRemoving}
            onClick={handleClick}>
            {isSaved ? <HeartIcon color='red' fill='red'/> :
                <HeartIcon color='gray' fill='gray'/>}
        </Button>
    )
}