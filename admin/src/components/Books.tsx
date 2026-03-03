import {type ColumnDef} from '@tanstack/react-table';
import {Download, Edit2, Eye, Trash2} from 'lucide-react';
import {Button} from "./ui/Button.tsx";
import {DataTable} from "./ui/Table.tsx";
import {Link, useNavigate} from "@tanstack/react-router";
import {deleteBooksByIdMutation, getBooksOptions, getBooksQueryKey, type ModelsBook} from "../api";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {alerts} from "@/ultis/confirm.tsx";
import {cn} from "@/ultis/cn.ts";

export default function BooksPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // 1. Mutation để xóa sách
    const { mutateAsync: deleteBook } = useMutation(deleteBooksByIdMutation());

    const onDeleteBook = async (id: string) => {
        deleteBook({ path: { id }}).then(() => {
            alerts.confirmSuccess("Đã xóa!", "Dữ liệu sách đã được loại bỏ khỏi hệ thống.");

            // Delete cache
            removeBookCache(id);
        }).catch(console.error)
    }

    // Hàm xóa nhanh
    const removeBookCache = (id: string) => {
        const bookKey = getBooksQueryKey({ query: { page: 1, size: 24}})
        const d = queryClient.getQueryData(bookKey) as { data: { items: ModelsBook[] } }

        // remove item id from an array
        const newBooks = d?.data?.items?.filter((book: ModelsBook) => book.id !== id) || [];
        queryClient.setQueryData(bookKey, { ...d, data: { ...d.data, items: newBooks } });
    };

    const onCreateBook = () => {
        navigate({ to: '/book/new' });
    };

    // 2. Định nghĩa Columns bên trong hoặc truyền mutation vào
    const columns: ColumnDef<ModelsBook>[] = [
        {
            accessorKey: 'cover',
            header: 'Bìa',
            cell: ({ row }) => (
                <div className="w-10 h-14 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                    {row.original.cover?.xs ? (
                        <img src={row.original.cover.xs} className="w-full h-full object-cover" alt="cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">No Img</div>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'name',
            header: 'Thông tin sách',
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-900 leading-none mb-1">{row.original.name}</span>
                    <span className="text-xs text-slate-500">{row.original.author?.name || 'Chưa rõ tác giả'}</span>
                </div>
            ),
        },
        {
            accessorKey: 'category',
            header: 'Danh mục',
            cell: ({ row }) => (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                    {row.original.category?.name || 'N/A'}
                </span>
            ),
        },
        {
            accessorKey: 'stats',
            header: 'Chỉ số',
            cell: ({ row }) => (
                <div className="flex items-center gap-3 text-slate-500">
                    <div className="flex items-center gap-1">
                        <Eye size={12} />
                        <span className="text-[11px] font-mono">{row.original.view_nums || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Download size={12} />
                        <span className="text-[11px] font-mono">{row.original.download_nums || 0}</span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'is_hidden',
            header: 'Trạng thái',
            cell: ({ row }) => (
                <span className={cn(
                    "px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                    !row.original.is_hidden ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                )}>
                    {row.original.is_hidden ? "Hidden" : "Visible"}
                </span>
            ),
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="flex justify-end gap-1">
                    <Link to='/book/$id' params={{ id: row.original.id as string }}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit2 size={14} />
                        </Button>
                    </Link>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-red-50 group"
                        onClick={() => alerts.confirm(
                            "Xóa sách?",
                            `Bạn có chắc chắn muốn xóa cuốn "${row.original.name}"?`,
                            () => onDeleteBook(row.original.id as string)
                        )}
                    >
                        <Trash2 size={14} className="text-slate-400 group-hover:text-red-500" />
                    </Button>
                </div>
            ),
        },
    ];

    const { data: response, isLoading } = useQuery(getBooksOptions({ query: { page: 1, size: 24 } }));
    const books = response?.data?.items || [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Kho sách</h1>
                    <p className="text-sm text-slate-500">Quản lý nội dung và tệp tin kỹ thuật số.</p>
                </div>
                <Button variant="primary" onClick={onCreateBook}>Thêm sách mới</Button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <DataTable columns={columns} data={books} pageSize={24} isLoading={isLoading} />
            </div>
        </div>
    );
}