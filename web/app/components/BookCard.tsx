import Link from "next/link";
import {Card, CardContent, CardFooter} from "@heroui/react";
import React from "react";
import {ModelsBook} from "@/app/api";

type Props = {
    book: ModelsBook
}
export const BookCard = ({book}: Props) => (
    <Link key={book.id} href={`/books/${book.id}`} className="group">
        <Card
            className="bg-transparent border-none"
        >
            <CardContent className="p-0 overflow-visible">
                {/* 3. Bìa sách ratio 1.6/1 */}
                <div
                    className="relative w-full aspect-[1/1.6] overflow-hidden rounded-xl shadow-md group-hover:shadow-xl transition-shadow duration-300">
                    {book.cover?.sm && (
                        <img
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                            src={book.cover?.sm || "/placeholder-book.jpg"}
                            alt={book.name || "Book Cover"}
                        />
                    )}
                </div>
            </CardContent>

            <CardFooter className="flex flex-col items-start px-1 py-3 gap-1">
                {/* Tên sách */}
                <h3 className="font-semibold text-small md:text-medium line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {book.name}
                </h3>
                {/* Tên tác giả */}
                <span className="text-tiny md:text-small text-default-400 truncate w-full">
                  {book.author?.name}
                </span>
            </CardFooter>
        </Card>
    </Link>

)