'use client';

import React from "react";
import {BookCard} from "@/app/components/BookCard";
import useEmblaCarousel from 'embla-carousel-react';
import Link from "next/link";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {ModelsBook} from "@/app/api";
import {Button} from "@heroui/react";

type Props = {
    title: string;
    description?: string;
    books: ModelsBook[];
    href?: string;
}

export default function FeaturedBooks({title, books, href = "/books"}: Props) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        containScroll: 'trimSnaps',
        // CHÌA KHÓA Ở ĐÂY: 'auto' sẽ nhảy hết số item đang hiện trên màn hình
        slidesToScroll: 'auto',
        duration: 20, // Tốc độ lướt nhanh vừa phải
    });

    return (
        <section className="relative group/section space-y-4">
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-xl font-bold">{title}</h3>
                </div>
                <Link href={href} className="text-sm font-semibold hover:underline text-primary">
                    Xem tất cả
                </Link>
            </div>

            <div className="relative">
                {/* Nút Prev */}
                <Button
                    onClick={() => emblaApi?.scrollPrev()}
                    isIconOnly
                    variant='ghost'
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden lg:flex shadow-xl bg-white/90 border border-gray-100 opacity-0 group-hover/section:opacity-100 transition-opacity"
                >
                    <ChevronLeft size={20}/>
                </Button>

                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-4">
                        {books?.map((book: ModelsBook) => (
                            <div
                                key={book.id}
                                // Mobile hiện ~2, Tablet hiện 4, Desktop hiện 6
                                className="flex-[0_0_calc(46%)] md:flex-[0_0_calc(25%-12px)] lg:flex-[0_0_calc(16.666%-14px)] min-w-0"
                            >
                                <BookCard book={book}/>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Nút Next */}
                <Button
                    onClick={() => emblaApi?.scrollNext()}
                    isIconOnly
                    variant='ghost'
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden lg:flex shadow-xl bg-white/90 border border-gray-100 opacity-0 group-hover/section:opacity-100 transition-opacity"
                >
                    <ChevronRight size={20}/>
                </Button>
            </div>
        </section>
    );
}