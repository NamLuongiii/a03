import {Breadcrumbs} from "@heroui/react";
import {BOOK_CATEGORIES} from "@/app/api/types";
import {ChevronRightIcon} from "lucide-react";
import Link from "next/link";

export default async function Page() {
    return <div className="space-y-6">
        <Breadcrumbs>
            <Breadcrumbs.Item href='/'>Trang chủ</Breadcrumbs.Item>
            <Breadcrumbs.Item>Tất cả danh mục</Breadcrumbs.Item>
        </Breadcrumbs>

        <div className='grid lg:grid-cols-2 gap-4'>
            {Object.entries(BOOK_CATEGORIES).map(([key, cate]) => (
                <Link key={key}
                      href={`/categories/${cate.id}`}
                      className="flex items-center gap-2 justify-between p-4 shadow-sm cursor-pointer">
                    <div className='text-lg'>{cate.label}</div>

                    <ChevronRightIcon className="h-4 w-4"/>
                </Link>
            ))}
        </div>
    </div>
}
