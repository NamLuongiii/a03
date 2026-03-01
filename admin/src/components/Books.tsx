import {type ColumnDef} from '@tanstack/react-table';
import {Edit2} from 'lucide-react';
import {cn} from "../ultis/cn.ts";
import {Button} from "./ui/Button.tsx";
import {DataTable} from "./ui/Table.tsx";
import {Link, useNavigate} from "@tanstack/react-router";

// Định nghĩa kiểu dữ liệu
type Book = {
    id: string;
    title: string;
    author: string;
    downloads: number;
    status: 'available' | 'hidden';
};

// Định nghĩa Columns bên ngoài component
const columns: ColumnDef<Book>[] = [
    {
        accessorKey: 'title',
        header: 'Tên sách',
        cell: ({ row }) => <span className="font-bold text-slate-900">{row.getValue('title')}</span>,
    },
    {
        accessorKey: 'author',
        header: 'Tác giả',
    },
    {
        accessorKey: 'downloads',
        header: 'Lượt tải',
        cell: ({ row }) => <span className="font-mono">{row.getValue('downloads')}</span>,
    },
    {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => (
            <span className={cn(
                "px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                row.getValue('status') === 'available' ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
            )}>
        {row.getValue('status')}
      </span>
        ),
    },
    {
        id: 'actions',
        header: '',
        cell: () => (
            <Link to='/book/$id' params={{ id: '1' }}>
                <Button variant="ghost" size="sm" className="hover:bg-white border-transparent">
                    <Edit2 size={14} className="text-slate-400" />
                </Button>
            </Link>

        ),
    },
];

const mockData: Book[] = [
    { id: '1', title: 'Lập trình Go cơ bản', author: 'Google Team', downloads: 1250, status: 'available' },
    { id: '2', title: 'React Performance', author: 'Dan Abramov', downloads: 850, status: 'available' },
    // ... thêm data khác
];

export default function BooksPage() {
    const navigate = useNavigate();

    const onCreateBook = () => {
        navigate({ to: '/book/new' }).then()
    }
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight">Quản lý kho sách</h1>
                <Button variant="primary" onClick={onCreateBook}>Thêm sách mới</Button>
            </div>

            {/* Gọi Table Component */}
            <DataTable columns={columns} data={mockData} pageSize={5} />
        </div>
    );
}