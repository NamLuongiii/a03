import {Breadcrumbs, Separator} from "@heroui/react";
import {getBooksAuthorsByAuthorId, ModelsAuthor} from "@/app/api";
import Avatar from "boring-avatars";

export default async function AuthorPage({params}: { params: Promise<{ authorID: string }> }) {
    // 1. Giải nén params (Next.js 15)
    const {authorID} = await params;

    // 2. Gọi API lấy thông tin tác giả
    const res = await getBooksAuthorsByAuthorId({path: {authorID: authorID}});
    const author = res.data?.data as ModelsAuthor;

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
                <Avatar/>

                {/* Thông tin chi tiết */}
                <div className="flex-1 space-y-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black uppercase tracking-tighter">
                            {author.name}
                        </h1>
                        <p className="text-tiny uppercase tracking-[0.2em] text-primary font-bold">
                            Tác giả chuyên nghiệp
                        </p>
                    </div>

                    <Separator/>

                    <div className="text-default-600 leading-relaxed text-medium whitespace-pre-wrap">
                        {author.summary || "Thông tin tác giả đang được cập nhật."}
                    </div>
                </div>
            </section>
        </div>
    );
}