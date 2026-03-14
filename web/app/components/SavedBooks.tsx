'use client'

import {useMe} from "@/app/hooks/useMe";
import {useQuery} from "@tanstack/react-query";
import {getUserBooks, ModelsUserBook} from "@/app/api";
import Link from "next/link";
import {Card, Separator, Skeleton} from "@heroui/react";
import {BookmarkIcon} from "lucide-react";

export default function SavedBooks() {
    const me = useMe()

    const {data, isLoading} = useQuery({
        queryKey: ['get-user-books', me?.id || ''],
        queryFn: async () => {
            const res = await getUserBooks()
            return res.data?.data || []
        },
        enabled: !!me
    })

    if (!me) return null

    const userBooks = (data || []) as ModelsUserBook[]
    const len = userBooks.length

    return (
        <Card className="w-full">
            <Card.Header className="flex gap-2 px-4 py-3">
                <BookmarkIcon size={16} className="text-default-500 mt-0.5"/>
                <div>
                    <p className="text-sm font-semibold">Sách đã lưu</p>
                    <p className="text-xs text-default-400">5 quyển gần nhất</p>
                </div>
            </Card.Header>

            <Separator className="my-0"/>

            <Card.Content className="px-0 py-0">
                {isLoading ? (
                    <div className="flex flex-col gap-3 p-4">
                        {Array.from({length: 3}).map((_, i) => (
                            <Skeleton key={i} className="h-4 w-full rounded"/>
                        ))}
                    </div>
                ) : len === 0 ? (
                    <p className="text-sm text-default-400 text-center py-6">
                        Chưa có sách nào được lưu
                    </p>
                ) : (
                    userBooks.map((book) => (
                        <Link
                            key={book.book_id}
                            href={`/books/${book.book_id}`}
                            className="flex items-center px-4 py-2.5 text-sm hover:bg-default-100 transition-colors"
                        >
                            {book.book?.name}
                        </Link>
                    ))
                )}
            </Card.Content>
        </Card>
    )
}