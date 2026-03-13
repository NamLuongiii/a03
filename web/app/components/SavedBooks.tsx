'use client'

import {useMe} from "@/app/hooks/useMe";
import {Card} from "@heroui/react";
import {useQuery} from "@tanstack/react-query";
import {getUserBooks, ModelsUserBook} from "@/app/api";
import Link from "next/link";

export default function SavedBooks() {
    const me = useMe()

    const {data} = useQuery({
        queryKey: ['get-user-books', me?.id || ''],
        queryFn: async () => getUserBooks(),
        enabled: !!me
    })


    if (!me) return null
    const userBooks = (data?.data?.data || []) as ModelsUserBook[]

    return (
        <Card>
            <Card.Content>
                <Card.Title>Sách đã lưu</Card.Title>
                <Card.Description>Hiển thị 5 quyển mới nhất</Card.Description>
                {userBooks.slice(0, 5).map((book) => (
                    <Link key={book.book_id} href={`/books/${book.book_id}`}>
                        {book.book?.name}
                    </Link>
                ))}

            </Card.Content>
        </Card>
    )
}