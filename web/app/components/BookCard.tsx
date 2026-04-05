import Link from "next/link";
import React from "react";
import {ModelsBook} from "@/app/api";
import {getFullUrl} from "@/app/helpers";

type Props = {
    book: ModelsBook
}
export const BookCard = ({book}: Props) => (
    <Link key={book.id} href={`/books/${book.id}`} className="group">
        <div className='space-y-2'>
            {/* 3. Bìa sách ratio 1.6/1 */}
            <div
                className="relative w-full">
                {book.cover?.md && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        className="object-cover w-full h-full"
                        src={getFullUrl(book.cover?.md) || "/placeholder-book.jpg"}
                        alt={book.name || "Book Cover"}
                    />
                )}
            </div>
            <div className='text-center'>
                {/*<small className='line-height-1 text-ellipsis'>{book.author?.name}</small>*/}
                {/* Tên sách */}
                <small className='line-clamp-2'>
                    {book.name}
                </small>
                {/* Tên tác giả */}

            </div>
        </div>
    </Link>

)