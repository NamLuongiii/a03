import {type ColumnDef} from '@tanstack/react-table';
import {Edit2} from 'lucide-react';
import {cn} from "../ultis/cn.ts";
import {Button} from "./ui/Button.tsx";
import {DataTable} from "./ui/Table.tsx";
import {Link, useNavigate} from "@tanstack/react-router";
import {getBooksOptions, type ModelsBook} from "../api";
import {useQuery} from "@tanstack/react-query";

// Định nghĩa Columns bên ngoài component
const columns: ColumnDef<ModelsBook>[] = [
    {
        accessorKey: 'title',
        header: 'Tên sách',
        cell: ({ row }) => <span className="font-bold text-slate-900">{row.original.name}</span>,
    },
    {
        accessorKey: 'author',
        header: 'Tác giả',
        cell: ({ row }) => <span className="text-slate-500">{row.original.author?.name || 'Tác giả chưa biết'}</span>,
    },
    {
        accessorKey: 'downloads',
        header: 'Lượt tải',
        cell: () => <span className="font-mono">{0}</span>,
    },
    {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => (
            <span className={cn(
                "px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                !row.original.is_hidden ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
            )}>
        Visible
      </span>
        ),
    },
    {
        id: 'actions',
        header: '',
        cell: ({row}) => (
            <Link to='/book/$id' params={{ id: row.original.id as string }}>
                <Button variant="ghost" size="sm" className="hover:bg-white border-transparent">
                    <Edit2 size={14} className="text-slate-400" />
                </Button>
            </Link>

        ),
    },
];

export default function BooksPage() {
    const navigate = useNavigate();

    const onCreateBook = () => {
        navigate({ to: '/book/new' }).then()
    }

    const { data } = useQuery(getBooksOptions({ query: { page: 1, size: 24 }}))

    const bs = data?.data?.items || []

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight">Quản lý kho sách</h1>
                <Button variant="primary" onClick={onCreateBook}>Thêm sách mới</Button>
            </div>

            {/* Gọi Table Component */}
            <DataTable columns={columns} data={bs} pageSize={24} />
        </div>
    );
}