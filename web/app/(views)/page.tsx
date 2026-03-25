export const revalidate = 12000;

import {getBooks, getBooksFeatured, ModelsBook} from "@/app/api";
import FeaturedBooks from "@/app/components/FeaturedBooks";
import Link from "next/link";
import {BOOK_CATEGORIES} from "@/app/api/types";


export default async function HomePage() {

    const [
        {data, error},
        {data: khoiNghiepData, error: khoiNghiepError},
        res3,
        res4,
        res5,
        res6,
        res7,
    ] = await Promise.all([
        getBooksFeatured({
            query: {
                recommender: 'new-books',
            }
        }),
        getBooks({
            query: {
                page: 1,
                size: 24,
                category: BOOK_CATEGORIES.KHOI_NGHIEP.id
            }
        }),
        getBooks({
            query: {
                page: 1,
                size: 24,
                category: BOOK_CATEGORIES.VAN_HOC.id
            }
        }),
        getBooks({
            query: {
                page: 1,
                size: 24,
                category: BOOK_CATEGORIES.TIEU_THUYET.id
            }
        }),
        getBooks({
            query: {
                page: 1,
                size: 24,
                category: BOOK_CATEGORIES.TRINH_THAM.id
            }
        }),
        getBooks({
            query: {
                page: 1,
                size: 24,
                category: BOOK_CATEGORIES.MARKETING.id
            }
        }),
        getBooks({
            query: {
                page: 1,
                size: 24,
                category: BOOK_CATEGORIES.TRIET_HOC.id
            }
        })
    ]);
    const books = data?.data || []
    const khoiNghiepBooks = khoiNghiepData?.data?.items || []

    if (error || khoiNghiepError || res3.error || res4.error || res5.error || res6.error || res7.error) {
        return <div className="py-10 text-center">Không thể tải dữ liệu sách.</div>;
    }

    return (
        <div className="space-y-4 lg:space-y-12">
            <div>
                <h3 className='text-base lg:text-2xl font-bold'>Khám phá</h3>
                <div className="grid grid-cols-2 gap-4 mt-4 lg:grid-cols-4">
                    <Link href='/categories'>
                        <div className='p-4 border'>
                            Thể loại sách
                        </div>
                    </Link>
                    <Link href='/rank'>
                        <div className='p-4 border'>
                            Bảng xếp hạng
                        </div>
                    </Link>
                </div>
            </div>

            {/* 2. Truyền dữ liệu vào component FeaturedBooks bạn vừa viết */}
            <FeaturedBooks
                title="Sách mới nhất"
                description="Sách mới cập nhật"
                books={books}
            />

            <FeaturedBooks
                title={BOOK_CATEGORIES.KHOI_NGHIEP.label}
                description="Sách khởi nghiệp mới"
                books={khoiNghiepBooks as ModelsBook[]}
                href={"/categories/" + BOOK_CATEGORIES.KHOI_NGHIEP.id}
            />

            <FeaturedBooks
                title={BOOK_CATEGORIES.VAN_HOC.label}
                description="Sách văn học mới"
                books={res3.data?.data?.items as ModelsBook[]}
                href={"/categories/" + BOOK_CATEGORIES.VAN_HOC.id}
            />

            <FeaturedBooks
                title={BOOK_CATEGORIES.TIEU_THUYET.label}
                description="Sách tiểu thuyết mới"
                books={res4.data?.data?.items as ModelsBook[]}
                href={"/categories/" + BOOK_CATEGORIES.TIEU_THUYET.id}
            />

            <FeaturedBooks
                title={BOOK_CATEGORIES.TRINH_THAM.label}
                description="Sách trinh thám mới"
                books={res5.data?.data?.items as ModelsBook[]}
                href={"/categories/" + BOOK_CATEGORIES.TRINH_THAM.id}
            />

            <FeaturedBooks
                title={BOOK_CATEGORIES.MARKETING.label}
                description="Sách bán hàng marketing mới"
                books={res6.data?.data?.items as ModelsBook[]}
                href={"/categories/" + BOOK_CATEGORIES.MARKETING.id}
            />

            <FeaturedBooks
                title={BOOK_CATEGORIES.TRIET_HOC.label}
                description="Sách triết học mới"
                books={res7.data?.data?.items as ModelsBook[]}
                href={"/categories/" + BOOK_CATEGORIES.TRIET_HOC.id}
            />
        </div>
    );
}