'use client'

import {Button, toast} from "@heroui/react";
import {HeartIcon} from "lucide-react";
import {useState} from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteUserBooksByBookId, postUserBooks} from "@/app/api";

type Props = {
    book_id: string
}

export default function SaveBook({book_id}: Props) {
    const [isSaved, setIsSaved] = useState(false)
    const queryClient = useQueryClient()

    const {mutateAsync, isPending: isAdding} = useMutation({
        mutationKey: ['save-book-to-user', book_id],
        mutationFn: (data: { book_id: string }) => postUserBooks({body: data}),
    })

    const {mutateAsync: removeBook, isPending: isRemoving} = useMutation({
        mutationKey: ['remove-book-from-user', book_id],
        mutationFn: (book_id: string) => deleteUserBooksByBookId({path: {book_id}})
    })


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
            isIconOnly={true}
            variant='tertiary'
            isDisabled={isAdding || isRemoving}
            onClick={handleClick}>
            {isSaved ? <HeartIcon color='red' fill='red'/> :
                <HeartIcon color='gray' fill='gray'/>}
        </Button>
    )
}