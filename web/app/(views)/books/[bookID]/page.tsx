import {Metadata} from "next";
import Link from "next/link";
import {Breadcrumbs, Button, Chip} from "@heroui/react";
import {getBooksById} from "@/app/api";
import {DownloadBook} from "@/app/components/DownloadBook";
import {Comments} from "@/app/components/Comments";
// Import file cấu hình API của bạn vào đây
// import { getBookDetail } from "@/services/book-service"; 
// import { ModelsBook } from "@/types";

// 1. Tối ưu SEO động (Server-side)
export async function generateMetadata({params}: { params: Promise<{ bookID: string }> }): Promise<Metadata> {
    const {bookID} = await params;
    const {data} = await getBooksById({path: {id: bookID}});
    const book = data?.data;

    if (!book) return {title: "Không tìm thấy sách | BookLab"};

    return {
        title: `${book.name} - Tác giả ${book.author?.name || "Đang cập nhật"} | BookLab`,
        description: book.summary || "Đọc sách online chất lượng cao tại BookLab.",
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
        <div className="max-w-6xl mx-auto py-6 space-y-8">

            {/* --- BREADCRUMBS --- */}
            <Breadcrumbs>
                <Breadcrumbs.Item href="/">Trang chủ</Breadcrumbs.Item>
                {book.category && (
                    <Breadcrumbs.Item href={`/categories/${book.category_id}`}>
                        {book.category.name}
                    </Breadcrumbs.Item>
                )}
                <Breadcrumbs.Item>{book.name}</Breadcrumbs.Item>
            </Breadcrumbs>

            {/* --- 2 CỘT LAYOUT --- */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">

                {/* CỘT TRÁI: Cover & Nút Đọc ngay */}
                <div className="col-span-1 md:col-span-4 lg:col-span-3 flex flex-col gap-4">
                    <div className="w-full aspect-[1/1.6] rounded-xl overflow-hidden shadow-lg border border-divider">
                        <img
                            alt={`Bìa sách ${book.name}`}
                            className="object-cover w-full h-full"
                            src={book.cover?.md || "/placeholder-cover.jpg"}
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
                <div className="col-span-1 md:col-span-8 lg:col-span-9 flex flex-col gap-4">
                    {/* Header Thông tin */}
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                            {book.name}
                        </h1>

                        <p className="text-lg text-default-600">
                            Tác giả: <Link href={`/authors/${book.author_id}`}
                                           className="text-primary hover:underline font-medium">{book.author?.name || "Đang cập nhật"}</Link>
                        </p>
                    </div>

                    {/* Các chỉ số (Rating, View, Download) */}
                    <div className="flex flex-wrap items-center gap-4">
                        <Chip>
                            <span>⭐</span>
                            {book.rating_avg ? book.rating_avg.toFixed(1) : "Chưa có đánh giá"} ({book.rating_count || 0})
                        </Chip>
                        <Chip>
                            <span>👁️</span>
                            {book.view_nums || 0} Lượt xem
                        </Chip>
                        <Chip>
                            <span>⬇️</span>
                            {book.download_nums || 0} Lượt tải
                        </Chip>
                    </div>


                    {/* Tóm tắt & Mô tả */}
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold">Giới thiệu</h3>
                        <div className="text-default-700 leading-relaxed text-medium whitespace-pre-line">
                            {book.description || book.summary || "Chưa có nội dung mô tả cho cuốn sách này."}
                        </div>
                    </div>

                    {/* Nút Tải Về (Chỉ hiện khi có file digital_books) */}
                    {book.digital_books && book.digital_books.length > 0 && (
                        <DownloadBook db={book.digital_books}/>
                    )}
                </div>

            </div>

            {/*Lời phê bình sách */}
            <div className='space-y-2 max-w-3xl mx-auto'>
                <h3 className="text-xl font-semibold">Lời tựa</h3>
                <div className='whitespace-pre-line text-default-700 leading-relaxed'>
                    {book.summary}
                </div>
            </div>

            <Comments bookID={bookID}/>
        </div>
    );
}