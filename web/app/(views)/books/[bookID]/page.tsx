import {Metadata} from "next";
import Link from "next/link";
import {Breadcrumbs, Button, Chip} from "@heroui/react";
import {getBooksById} from "@/app/api";
import {DownloadBook} from "@/app/components/DownloadBook";
import {Comments} from "@/app/components/Comments";
import {getFullUrl} from "@/app/helpers";
import SaveBook from "@/app/components/SaveBook";

export const revalidate = 1800;

// Import file cấu hình API của bạn vào đây
// import { getBookDetail } from "@/services/book-service"; 
// import { ModelsBook } from "@/types";

// 1. Tối ưu SEO động (Server-side)
export async function generateMetadata({params}: { params: Promise<{ bookID: string }> }): Promise<Metadata> {
    const {bookID} = await params;
    const {data} = await getBooksById({path: {id: bookID}});
    const book = data?.data;

    if (!book) return {title: "Không tìm thấy sách | Đọc Luôn"};

    return {
        title: `${book.name} - Tác giả ${book.author?.name || "Đang cập nhật"} | Đọc Luôn`,
        description: book.summary || "Đọc sách online chất lượng cao tại Đọc Luôn.",
        openGraph: {
            title: book.name,
            description: book.summary,
            images: [book.cover?.sm || "/placeholder-cover.jpg"],
            type: "book",
        },
    };
}

// 2. Main Page (Server Component)
export default async function BookDetailPage({params}: { params: Promise<{ bookID: string }> }) {
    const {bookID} = await params;
    const {data} = await getBooksById({path: {id: bookID}});
    const book = data?.data;

    if (!book) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h1 className="text-2xl font-bold">Không tìm thấy sách</h1>
                <Button className="mt-4">Về trang chủ</Button>
            </div>
        );
    }

    return (
        <div className="space-y-4 md:space-y-8">

            {/* --- BREADCRUMBS --- */}
            <Breadcrumbs className="text-xs md:text-sm">
                <Breadcrumbs.Item href="/">Trang chủ</Breadcrumbs.Item>
                <Breadcrumbs.Item href='/books'>Tất cả</Breadcrumbs.Item>
                {book.category && (
                    <Breadcrumbs.Item href={`/categories/${book.category_id}`}>
                        {book.category.name}
                    </Breadcrumbs.Item>
                )}
                <Breadcrumbs.Item className="hidden md:inline">{book.name}</Breadcrumbs.Item>
            </Breadcrumbs>

            {/* --- 2 CỘT LAYOUT --- */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 lg:gap-12">

                {/* CỘT TRÁI: Cover & Nút Đọc ngay */}
                <div className="col-span-1 md:col-span-4 lg:col-span-3 flex flex-col gap-3 md:gap-4">
                    <div
                        className="w-1/2 md:w-full mx-auto aspect-[1/1.6] rounded-lg md:rounded-xl overflow-hidden shadow-lg border border-divider">
                        <img
                            alt={`Bìa sách ${book.name}`}
                            className="object-cover w-full h-full"
                            src={getFullUrl(book.cover?.md) || "/placeholder-cover.jpg"}
                            width="100%"
                        />
                    </div>

                    <Link href={`/read/${book.id}`}>
                        <Button
                            size="lg"
                            className="w-full font-bold shadow-md"
                        >
                            <span>📖</span>
                            Đọc Ngay
                        </Button>
                    </Link>

                </div>

                {/* CỘT PHẢI: Thông tin sách & Nút Tải về */}
                <div className="col-span-1 md:col-span-8 lg:col-span-9 flex flex-col gap-5">
                    {/* Tên & Tác giả */}
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">{book.name}</h2>
                        <p className="text-sm text-default-500">
                            Tác giả:{" "}
                            <Link
                                href={`/authors/${book.author_id}`}
                                className="text-primary font-medium hover:underline">
                                {book.author?.name || "Đang cập nhật"}
                            </Link>
                        </p>
                    </div>

                    {/* Thống kê */}
                    <div className="flex flex-wrap gap-2">
                        <Chip size="sm">
                            <span>⭐</span>
                            {book.rating_avg?.toFixed(1) ?? "N/A"} ({book.rating_count || 0})
                        </Chip>
                        <Chip size="sm">
                            <span>👁️</span>
                            {book.view_nums || 0} lượt xem
                        </Chip>
                        <Chip size="sm">
                            <span>⬇️</span>
                            {book.download_nums || 0} lượt tải
                        </Chip>
                    </div>

                    {/* Mô tả */}
                    <div>
                        <h3 className="text-base font-semibold mb-2">Giới thiệu</h3>
                        <p className="text-sm text-default-600 leading-relaxed whitespace-pre-line">
                            {book.description || book.summary || "Chưa có nội dung mô tả cho cuốn sách này."}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {book.digital_books && book.digital_books.length > 0 && (
                            <DownloadBook db={book.digital_books}/>
                        )}
                        <SaveBook book_id={bookID}/>
                    </div>
                </div>
            </div>

            {/*Lời phê bình sách */}
            <div className="space-y-2">
                <h3 className="text-base font-semibold">Lời tựa</h3>
                <p className="text-sm text-default-600 leading-relaxed whitespace-pre-line">
                    {book.summary}
                </p>
            </div>

            <Comments bookID={bookID}/>
        </div>
    );
}