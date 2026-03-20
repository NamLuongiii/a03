import {getBooks, ModelsBook} from "@/app/api";
import BookPagination from "@/app/components/BookPagination";
import {BookCard} from "@/app/components/BookCard";
import {Breadcrumbs} from "@heroui/react";

type Props = {
    params: Promise<{ cateID: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CategoryPage({params, searchParams}: Props) {
    // 1. Giải nén params và searchParams (Next.js 15)
    const {cateID} = await params;
    const resolvedSearchParams = await searchParams;

    const page = Number(resolvedSearchParams.page) || 1;
    const size = 24; // Cố định size 24 như bạn muốn

    // 2. Gọi API filter theo Category
    const res = await getBooks({
        query: {
            category: cateID,
            page: page,
            size: size
        }
    });

    const pgd = res.data?.data;
    const books = (pgd?.items as ModelsBook[]) || [];
    const total = pgd?.total || 0;
    const totalPages = Math.ceil(total / size) || 1;

    return (
        <div className="space-y-10">
            <Breadcrumbs>
                <Breadcrumbs.Item href="/">Trang chủ</Breadcrumbs.Item>
                <Breadcrumbs.Item href="/categories">Danh mục</Breadcrumbs.Item>
            </Breadcrumbs>

            {/* Header: Hiển thị tên Category (nếu API có trả về tên, hoặc dùng ID tạm) */}
            <div className="flex flex-col gap-2 border-l-4 border-primary pl-4">
                <h1 className="text-lg font-semibold">
                    Thể loại: {cateID}
                </h1>
                <p className="text-tiny text-default-400 uppercase tracking-widest">
                    Tìm thấy {total} cuốn sách
                </p>
            </div>

            {/* Grid Sách */}
            {books.length > 0 ? (
                <div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
                    {books.map((book) => (
                        <BookCard key={book.id} book={book}/>))}
                </div>
            ) : (
                <p className="text-sm text-default-400 italic">
                    Hiện chưa có sách nào trong thể loại này.
                </p>
            )}

            {/* Phân trang */}
            <div className="flex justify-center pt-8">
                <BookPagination totalPages={totalPages} page={page}/>
            </div>
        </div>
    );
}