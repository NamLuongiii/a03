import {getBooksFeatured} from "@/app/api";
import FeaturedBooks from "@/app/components/FeaturedBooks";

export default async function HomePage() {
    const {data, error} = await getBooksFeatured({
        query: {
            recommender: 'new-books'
        }
    });
    const books = data?.data || []

    if (error) {
        return <div className="py-10 text-center">Không thể tải dữ liệu sách.</div>;
    }

    return (
        <div className="space-y-12">
            {/* 2. Truyền dữ liệu vào component FeaturedBooks bạn vừa viết */}
            <FeaturedBooks
                title="Sách mới nhất"
                description="Những cuốn sách vừa cập nhật trên hệ thống."
                books={books}
            />

            {/* Bạn có thể gọi thêm các Section khác ở đây */}
            <FeaturedBooks
                title="Sách xem nhiều"
                books={books?.slice(0, 5)}
            />
        </div>
    );
}