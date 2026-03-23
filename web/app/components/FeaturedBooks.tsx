'use client';

import React, {useCallback} from "react";
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

export default function FeaturedBooks({title, description, books, href = "/books"}: Props) {
    const [emblaRef, emblaApi] = useEmblaCarousel({align: 'start', dragFree: true});

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    return (
        <section className="relative">
            {/* Header */}
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h3 className="text-base lg:text-2xl font-bold text-wave-bold">{title}</h3>
                    {description && <p className="text-gray-500 text-sm">{description}</p>}
                </div>
                <Link href={href} className="text-primary hover:underline text-sm font-medium">
                    Xem tất cả
                </Link>
            </div>

            {/* Carousel Container */}
            <div className="relative mx-4">
                {/* Nút Prev */}
                <Button
                    onClick={scrollPrev}
                    isIconOnly
                    size='lg'
                    variant='tertiary'
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-10/12 z-10 border"
                >
                    <ChevronLeft size={20}/>
                </Button>

                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-4 md:gap-6">
                        {books?.map((book: ModelsBook) => (
                            <div
                                key={book.id}
                                // MOBILE: 2 cuốn (50% - gap)
                                // TABLET/DESKTOP: 4 cuốn (25%)
                                // LG trở lên: 6 cuốn (16.66%)
                                className="flex-[0_0_calc(50%-8px)] md:flex-[0_0_calc(25%-12px)] lg:flex-[0_0_calc(16.66%-20px)] min-w-0"
                            >
                                <BookCard book={book}/>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Nút Next */}
                <Button
                    onClick={scrollNext}
                    variant='tertiary'
                    size='lg'
                    isIconOnly
                    className="absolute top-1/2 right-0 -translate-y-10/12 translate-x-1/2 z-10 p-2 border"
                >
                    <ChevronRight size={20}/>
                </Button>
            </div>
        </section>
    );
}