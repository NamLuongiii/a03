import {Metadata} from "next";
import {Breadcrumbs, Button} from "@heroui/react";
import {getBooksById} from "@/app/api";
import {Comments} from "@/app/components/Comments";
import BookInformation from "@/app/components/BookInformation";

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
                    <Breadcrumbs.Item className='hidden lg:flex' href={`/categories/${book.category_id}`}>
                        {book.category.name}
                    </Breadcrumbs.Item>
                )}
                <Breadcrumbs.Item className="hidden md:inline">{book.name}</Breadcrumbs.Item>
            </Breadcrumbs>

            {/* --- 2 CỘT LAYOUT --- */}
            <BookInformation book={book}/>

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