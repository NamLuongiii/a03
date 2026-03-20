import {getFullUrl} from "@/app/helpers";
import Link from "next/link";
import {Button, Chip} from "@heroui/react";
import {DownloadIcon} from "lucide-react";
import SaveBook from "@/app/components/SaveBook";
import {ModelsBook} from "@/app/api";

type Props = {
    book: ModelsBook
}

export default function BookInformation({book}: Props) {
    return <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 lg:gap-12">

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
                    <Link href={`/download/${book.id}`}>
                        <Button isIconOnly variant='tertiary'>
                            <DownloadIcon/>
                        </Button>
                    </Link>
                )}
                {book.id && (
                    <SaveBook book_id={book.id}/>
                )}
            </div>
        </div>
    </div>
}