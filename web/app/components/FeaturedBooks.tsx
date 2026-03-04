'use client';

import React from "react";
import {Card, CardContent, CardFooter} from "@heroui/react";
import Link from "next/link";
import {ModelsBook} from "@/app/api";


interface FeaturedBooksProps {
    title: string;
    description?: string;
    books: ModelsBook[] | undefined;
}

export default function FeaturedBooks({title, description, books}: FeaturedBooksProps) {
    return (
        <section className="py-8">
            {/* 1. Tiêu đề & Mô tả */}
            <div className="flex flex-col mb-8">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                    {title}
                </h2>
                {description && (
                    <p className="text-default-500 mt-2 max-w-2xl text-small md:text-medium">
                        {description}
                    </p>
                )}
            </div>

            {/* 2. Danh sách sách (Grid) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {books?.map((book) => (
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
                ))}
            </div>
        </section>
    );
}