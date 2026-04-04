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
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        dragFree: true,
        containScroll: 'trimSnaps' // UX: Không cho phép scroll lố ở cuối danh sách
    });

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    return (
        <section className="group/section relative py-4">
            {/* Header: Cân đối lại size chữ và khoảng cách */}
            <div className="flex justify-between items-center mb-6">
                <div className="space-y-1">
                    <h3 className="text-xl lg:text-2xl font-bold tracking-tight text-gray-900">{title}</h3>
                    {description && <p className="text-gray-500 text-sm">{description}</p>}
                </div>
                <Link href={href} className="text-sm font-semibold">
                    Xem tất cả →
                </Link>
            </div>

            {/* Carousel Container */}
            <div className="relative overflow-visible">
                {/* Nút Prev: Chỉnh vị trí ra ngoài mép một chút và đổ bóng */}
                <Button
                    onClick={scrollPrev}
                    isIconOnly
                    variant='secondary'
                    className="hidden lg:flex absolute top-1/2 -left-5 -translate-y-1/2 z-20 shadow-lg opacity-0 group-hover/section:opacity-100 transition-opacity"
                >
                    <ChevronLeft size={24}/>
                </Button>

                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-4 lg:gap-5">
                        {books?.map((book: ModelsBook) => (
                            <div
                                key={book.id}
                                // Responsive: Mobile 2.2 cuốn (để người dùng biết còn có thể scroll tiếp)
                                className="flex-[0_0_calc(45%)] md:flex-[0_0_calc(25%-15px)] lg:flex-[0_0_calc(16.66%-17px)] min-w-0"
                            >
                                <div className="transition-transform duration-300 hover:-translate-y-2">
                                    <BookCard book={book}/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Nút Next */}
                <Button
                    onClick={scrollNext}
                    isIconOnly
                    variant='secondary'
                    className="hidden lg:flex absolute top-1/2 -right-5 -translate-y-1/2 z-20 shadow-lg opacity-0 group-hover/section:opacity-100 transition-opacity"
                >
                    <ChevronRight size={24}/>
                </Button>
            </div>
        </section>
    );
}