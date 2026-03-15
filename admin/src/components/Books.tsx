import {type ColumnDef} from '@tanstack/react-table';
import {Download, Edit2, Eye, Trash2} from 'lucide-react';
import {DataTable} from "./ui/Table.tsx";
import {Link, useNavigate} from "@tanstack/react-router";
import {deleteBooksByIdMutation, getBooksOptions, getBooksQueryKey, type ModelsBook} from "../api";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Button, Chip} from "@heroui/react";
import {useAlerts} from "@/providers/AlertProvider.tsx";
import {useMemo, useState} from "react";
import {getFullURL} from "@/ultis/getFullURL.ts";

type TQuery = {
    search?: string,
    category?: string,
}

export default function BooksPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const alerts = useAlerts()

    const [page, setPage] = useState(1);
    const [queries, setQueries] = useState<TQuery | null>()

    // 1. Mutation để xóa sách
    const {mutateAsync: deleteBook} = useMutation(deleteBooksByIdMutation());

    const onDeleteBook = async (id: string) => {
        deleteBook({path: {id}}).then(() => {
            alerts.success("Đã xóa!", "Thành công", () => {
            });
            // Delete cache
            removeBookCache(id);
        }).catch(console.error)
    }

    // Hàm xóa nhanh
    const removeBookCache = (id: string) => {
        const bookKey = getBooksQueryKey({
            query: {
                page: 1, size: 24, ...queries
            }
        })
        const d = queryClient.getQueryData(bookKey) as { data: { items: ModelsBook[] } }

        // remove item id from an array
        const newBooks = d?.data?.items?.filter((book: ModelsBook) => book.id !== id) || [];
        queryClient.setQueryData(bookKey, {...d, data: {...d.data, items: newBooks}});
    };

    const onCreateBook = () => {
        navigate({to: '/book/new'});
    };

    const forms = useMemo(() => {
        return [
            {
                name: 'search', title: 'Tên',
            }, {
                name: 'category', title: 'Danh mục ID',

            }
        ]
    }, [])

    const onFormSubmit = (data: Record<string, string>) => {
        const q = {} as TQuery;
        if (data.search) {
            q['search'] = data.search;
        }
        if (data.category) {
            q['category'] = data.category;
        }
        setQueries(q)
    }

    // 2. Định nghĩa Columns bên trong hoặc truyền mutation vào
    const columns: ColumnDef<ModelsBook>[] = [
        {
            accessorKey: 'cover',
            header: 'Bìa',
            cell: ({row}) => (
                <div className="w-10 h-14 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                    {row.original.cover?.xs ? (
                        <img src={getFullURL(row.original.cover.xs)} className="w-full h-full object-cover"
                             alt="cover"/>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">No
                            Img</div>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'name',
            header: 'Thông tin sách',
            cell: ({row}) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-900 leading-none mb-1">{row.original.name}</span>
                    <span className="text-xs text-slate-500">{row.original.author?.name || 'Chưa rõ tác giả'}</span>
                    <div>
                        {!row.original.unzip_root_url && <Chip color='warning' variant='soft'>Cần update file</Chip>}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'category',
            header: 'Danh mục',
            cell: ({row}) => (
                <span
                    className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                    {row.original.category?.name || 'N/A'}
                </span>
            ),
        },
        {
            accessorKey: 'stats',
            header: 'Chỉ số',
            cell: ({row}) => (
                <div className="flex items-center gap-3 text-slate-500">
                    <div className="flex items-center gap-1">
                        <Eye size={12}/>
                        <span className="text-[11px] font-mono">{row.original.view_nums || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Download size={12}/>
                        <span className="text-[11px] font-mono">{row.original.download_nums || 0}</span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'is_hidden',
            header: 'Trạng thái',
            cell: ({row}) => (
                <Chip variant='soft'
                      color={row.original.is_hidden ? 'danger' : 'success'}>
                    {row.original.is_hidden ? "Hidden" : "Visible"}</Chip>
            ),
        },
        {
            id: 'actions',
            header: '',
            cell: ({row}) => (
                <div className="flex justify-end gap-1">
                    <Link to='/book/$id' params={{id: row.original.id as string}}>
                        <Button
                            variant='tertiary'
                            isIconOnly>
                            <Edit2 size={14}/>
                        </Button>
                    </Link>

                    <Button
                        variant='tertiary'
                        isIconOnly
                        onClick={() => alerts.confirm(
                            'Xoá sách',
                            `Bạn có chắc chắn muốn xóa cuốn "${row.original.name}"?`,
                            () => onDeleteBook(row.original.id as string)
                        )}
                    >
                        <Trash2 size={14}/>
                    </Button>
                </div>
            ),
        },
    ];

    const {data: response, isLoading} = useQuery(getBooksOptions({query: {page: page, size: 24, ...queries}}));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Kho sách</h1>
                    <p className="text-sm text-slate-500">Quản lý nội dung và tệp tin kỹ thuật số.</p>
                </div>
                <Button onPress={onCreateBook}>Thêm sách mới</Button>
            </div>

            {response?.data && response.data.items && (
                <DataTable
                    columns={columns}
                    paginationData={response.data}
                    isLoading={isLoading}
                    setPage={setPage}
                    forms={forms}
                    onFormSubmit={onFormSubmit}
                />
            )}
        </div>
    );
}