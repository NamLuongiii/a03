// export const revalidate = 1800;

import {getBooks, ModelsBook} from "@/app/api";
import BookPagination from "@/app/(views)/books/components/BookPagination";
import {BookCard} from "@/app/components/BookCard";
import {Breadcrumbs} from "@heroui/react";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function BooksPage({searchParams}: Props) {
    const resolvedSearchParams = await searchParams;

    const page = Number(resolvedSearchParams.page) || 1;
    const size = Number(resolvedSearchParams.size) || 24; // 12 thường chia hết cho 2, 3, 4, 6 nên grid đẹp hơn
    const search = (resolvedSearchParams.search as string) || "";
    const author = (resolvedSearchParams.author as string) || "";

    // Giả sử API của bạn trả về data có total_pages hoặc total_items
    const {data} = await getBooks({
        query: {
            page,
            size,
            search,
            author,
        }
    });
    const paginationData = data?.data

    const books = (paginationData?.items as ModelsBook[]) || [];
    // Tính toán tổng số trang (Ví dụ backend trả về meta.total)
    const totalItems = paginationData?.total || 0;
    const totalPages = Math.ceil(totalItems / size) || 1;

    return (
        <div className="space-y-8">
            <Breadcrumbs>
                <Breadcrumbs.Item href="/">Trang chủ</Breadcrumbs.Item>
                <Breadcrumbs.Item>Tất cả sách</Breadcrumbs.Item>
            </Breadcrumbs>

            {/* Header section */}
            <div className="flex flex-col gap-2">
                <h1 className="text-lg font-semibold">
                    {search ? `Kết quả: ${search}` : "Thư viện sách"}
                </h1>
                <div className="h-1 w-12 bg-primary"/>
            </div>

            {/* Grid Book Responsive */}
            {books.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {books.map((book) => (
                        <BookCard key={book.id} book={book}/>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center">
                    <p className="text-default-400">Không tìm thấy cuốn sách nào khớp với yêu cầu của bạn.</p>
                </div>
            )}

            {/* Phân trang */}
            <BookPagination totalPages={totalPages} page={page}/>
        </div>
    );
}