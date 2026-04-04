'use client'
import {Card} from '@heroui/react'
import {useMe} from "@/app/hooks/useMe";
import {useQuery} from "@tanstack/react-query";
import {getUserBooks, ModelsUserBook} from "@/app/api";
import {getFullUrl} from "@/app/helpers";
import Link from "next/link";

export default function ProfilePage() {
    const me = useMe()
    const {data} = useQuery({
        queryKey: ['user-books'],
        queryFn: () => getUserBooks()
    })

    if (!me) return null
    const userBooks = (data?.data?.data || []) as ModelsUserBook[]
    return (
        <div className='space-y-12'>
            <Card className="w-full max-w-2xl p-8 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div>
                        <h3 className="text-2xl font-semibold">
                            {me.name}
                        </h3>
                        <p className="text-default-500 text-sm">
                            {me.email}
                        </p>
                    </div>
                </div>
            </Card>

            <div className='space-y-6'>
                <h3>Sách của tôi</h3>
                {userBooks.map((userBook: ModelsUserBook) => (
                    <Link
                        key={userBook.book_id}
                        href={`/books/${userBook.book_id}`}
                        className='flex gap-4'
                    >
                        {userBook.book?.cover?.md && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={getFullUrl(userBook.book?.cover.md)} alt='cover' width={100}/>
                        )}
                        <div>
                            <div>{userBook.book?.name}</div>
                            <small>{userBook.book?.author?.name}</small>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

