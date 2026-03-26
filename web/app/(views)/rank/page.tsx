import {getFullUrl} from "@/app/helpers";
import {getBooksMostViewed, ModelsBook} from "@/app/api";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 1800;

export default async function Page() {
    const res = await getBooksMostViewed()
    const books: ModelsBook[] = res.data?.data || []

    return <div>
        <header className='mb-8'>
            <h1>Sách có lượt xem cao nhất</h1>
            <small><i>Bảng xếp hạng</i></small>
        </header>

        <div className='space-y-8'>
            {books.map((book, index) => (
                <Link key={book.id} href={`/books/${book.id}`} className="flex items-start gap-4">
                    <div className='lg:text-lg'><i>{index + 1}</i></div>
                    {book.cover?.md && (
                        <Image src={getFullUrl(book.cover?.md)} alt={book.name || ''} width={100} height={140}/>
                    )}
                    <div>
                        <p>{book.name}</p>
                        <div><small>{book.author?.name}</small></div>
                        <small><i>Số lượt xem: {book.view_nums}</i></small>
                    </div>
                </Link>
            ))}
        </div>
    </div>
}