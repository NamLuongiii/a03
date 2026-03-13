'use client';

import React from "react";
import {ModelsBook} from "@/app/api";
import {BookCard} from "@/app/components/BookCard";


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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {books?.map((book) => (
                    <BookCard key={book.id} book={book}/>
                ))}
            </div>
        </section>
    );
}