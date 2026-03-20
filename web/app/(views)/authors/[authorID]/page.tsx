import {Breadcrumbs, Separator} from "@heroui/react";
import {getBooksAuthorsByAuthorId, ModelsAuthor} from "@/app/api";
import Avatar from "boring-avatars";
import {BookCard} from "@/app/components/BookCard";

export default async function AuthorPage({params}: { params: Promise<{ authorID: string }> }) {
    // 1. Giải nén params (Next.js 15)
    const {authorID} = await params;

    // 2. Gọi API lấy thông tin tác giả
    const res = await getBooksAuthorsByAuthorId({path: {authorID: authorID}});
    const author = res.data?.data?.author as ModelsAuthor || []
    const books = res.data?.data?.books as ModelsAuthor[] || []

    if (!author) return <div className="py-20 text-center uppercase tracking-widest text-tiny">Không tìm thấy tác
        giả</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            {/* Breadcrumbs */}
            <Breadcrumbs>
                <Breadcrumbs.Item href="/">Trang chủ</Breadcrumbs.Item>
                <Breadcrumbs.Item href="/">Tác giả</Breadcrumbs.Item>
                <Breadcrumbs.Item>{author.name}</Breadcrumbs.Item>
            </Breadcrumbs>

            <section className="flex flex-col md:flex-row gap-8 items-start">
                {/* Ảnh đại diện tác giả */}
                <Avatar size={120} variant='abstract'/>

                {/* Thông tin chi tiết */}
                <div className="flex-1 space-y-4">
                    <div className="space-y-1">
                        <h1 className="text-lg font-black">
                            {author.name}
                        </h1>
                    </div>

                    <div className="text-default-600 leading-relaxed text-medium whitespace-pre-wrap">
                        {author.summary || "Thông tin tác giả đang được cập nhật."}
                    </div>
                </div>
            </section>

            <Separator/>

            <section className="space-y-4">
                <div className='font-semibold'>Sách</div>
                <div
                    className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8'>
                    {books.map(book => (
                        <BookCard book={book} key={book.id}/>
                    ))}
                </div>
            </section>
        </div>
    );
}