import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import type {TypesPaginationData} from "@/api";
import {type NonUndefined} from "react-hook-form";

type PaginationData<T> = NonUndefined<TypesPaginationData> & {
    items?: T[]
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    isLoading?: boolean; // Thêm prop loading
    paginationData?: PaginationData<TData>;
    setPage: (newPage: number) => void;
}

export function DataTable<TData, TValue>({
                                             columns,
                                             isLoading = false,
                                             paginationData,
                                             setPage: _setPage,
                                         }: DataTableProps<TData, TValue>) {
    const items = paginationData?.items || [];
    const page = paginationData?.page || 1;
    const size = paginationData?.size || 24;
    const total = paginationData?.total || 0;

    const table = useReactTable({
        data: items || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
    });

    const totalPages = Math.ceil((total || 0) / size);

    const getPageNumbers = () => {
        const pages: (number | "ellipsis")[] = [];
        pages.push(1);
        if (page > 3) {
            pages.push("ellipsis");
        }
        const start = Math.max(2, page - 1);
        const end = Math.min(totalPages - 1, page + 1);
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        if (page < totalPages - 2) {
            pages.push("ellipsis");
        }
        if (totalPages != 1)
            pages.push(totalPages);
        return pages;
    };

    return (
        <div className='space-y-6'>
            <div className="card w-full">
                <div className="w-full overflow-x-auto">
                    <table className="table">
                        <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody>
                        {!isLoading ? table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className='row-hover'>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        )) : <tr>
                            <td colSpan={1000}>
                                <div className="progress" role="progressbar" aria-label="Warning Progressbar"
                                     aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                                    <div
                                        className="progress-bar progress-warning progress-striped progress-animated w-full"></div>
                                </div>
                            </td>
                        </tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {paginationData && (
                <nav className="flex items-center gap-x-1">
                    <button type="button" className="btn btn-soft">Trước</button>
                    <div className="flex items-center gap-x-1">
                        {getPageNumbers().map((page, index) => (
                            <button type="button"
                                    className="btn btn-soft btn-square aria-[current='page']:text-bg-soft-primary"
                                    key={index}
                                    aria-current={page === paginationData.page ? 'page' : false}
                                    onClick={() => typeof page === 'number' && _setPage(page)}
                            >
                                {typeof page === 'number' ? page : '...'}
                            </button>
                        ))}
                    </div>
                    <button type="button" className="btn btn-soft">Sau</button>
                </nav>
            )}
        </div>
    );
}