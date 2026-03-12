'use client';

import {Pagination} from "@heroui/react";
import {useRouter, useSearchParams} from "next/navigation";

export default function BookPagination({totalPages, page}: { totalPages: number, page: number }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const setPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`?${params.toString()}`);
    };

    const getPageNumbers = () => {
        const pages: (number | "ellipsis")[] = [];
        pages.push(1);
        if (page > 3) {
            pages.push("ellipsis");
        }
        const start = Math.max(2, page - 1);
        const end = Math.min(totalPages - 1, page + 1);
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        if (page < totalPages - 2) {
            pages.push("ellipsis");
        }
        pages.push(totalPages);
        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <Pagination className="justify-center">
            <Pagination.Content className="mx-auto">
                <Pagination.Item>
                    <Pagination.Previous isDisabled={page === 1} onPress={() => setPage(page - 1)}>
                        <Pagination.PreviousIcon/>
                        <span className="hidden sm:inline">Quay lại</span>
                    </Pagination.Previous>
                </Pagination.Item>
                {getPageNumbers().map((p, i) =>
                    p === "ellipsis" ? (
                        <Pagination.Item key={`ellipsis-${i}`} className="hidden sm:flex">
                            <Pagination.Ellipsis/>
                        </Pagination.Item>
                    ) : (
                        <Pagination.Item key={p}
                                         className={p !== 1 && p !== totalPages && p !== page ? 'hidden sm:flex' : ''}>
                            <Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
                                {p}
                            </Pagination.Link>
                        </Pagination.Item>
                    ),
                )}
                <Pagination.Item>
                    <Pagination.Next isDisabled={page === totalPages} onPress={() => setPage(page + 1)}>
                        <span className="hidden sm:inline">Tiếp theo</span>
                        <Pagination.NextIcon/>
                    </Pagination.Next>
                </Pagination.Item>
            </Pagination.Content>
        </Pagination>
    );
}