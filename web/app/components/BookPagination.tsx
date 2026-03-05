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

    if (totalPages <= 1) return null;

    return (
            <Pagination className="justify-center">
                <Pagination.Content>
                    <Pagination.Item>
                        <Pagination.Previous isDisabled={page === 1} onPress={() => setPage(page - 1)}>
                            <Pagination.PreviousIcon/>
                            <span>Quay lại</span>
                        </Pagination.Previous>
                    </Pagination.Item>
                    {Array.from({length: totalPages}, (_, i) => i + 1).map((p) => (
                        <Pagination.Item key={p}>
                            <Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
                                {p}
                            </Pagination.Link>
                        </Pagination.Item>
                    ))}
                    <Pagination.Item>
                        <Pagination.Next isDisabled={page === totalPages} onPress={() => setPage(page + 1)}>
                            <span>Tiếp theo</span>
                            <Pagination.NextIcon/>
                        </Pagination.Next>
                    </Pagination.Item>
                </Pagination.Content>
            </Pagination>
    );
}