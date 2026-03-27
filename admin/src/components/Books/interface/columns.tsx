import type {ColumnDef} from "@tanstack/react-table";
import type {ModelsBook} from "@/api";
import {getFullURL} from "@/ultis/getFullURL.ts";
import {Link} from "@tanstack/react-router";

export const columns: ColumnDef<ModelsBook>[] = [
    {
        accessorKey: 'cover',
        header: 'Bìa',
        cell: ({row}) => {
            return row.original.cover?.xs ? (
                <img src={getFullURL(row.original.cover.xs)} width={40}
                     alt="cover"/>
            ) : (
                <div>[Chưa có bìa]</div>
            )
        },
    },
    {
        accessorKey: 'name',
        header: 'Tên',
        cell: ({row}) => <Link to={`/book/${row.original.id}`}>{row.original.name}</Link>,
    },
    {
        accessorKey: 'author',
        header: 'Tác giả',
        cell: ({row}) => row.original.author?.name,
    },
    {
        accessorKey: 'category',
        header: 'Danh mục',
        cell: ({row}) => row.original.category?.name
    },
    {
        accessorKey: 'view_nums',
        header: 'Lượt xem',
        cell: ({row}) => row.original.view_nums
    },
    {
        accessorKey: 'download_nums',
        header: 'Lượt tải',
        cell: ({row}) => row.original.download_nums
    },
];
