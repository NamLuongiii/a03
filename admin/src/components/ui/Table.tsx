import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2} from 'lucide-react';
import {Button} from './Button';
import {cn} from "@/ultis/cn.ts";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageSize?: number;
    isLoading?: boolean; // Thêm prop loading
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                             pageSize = 10,
                                             isLoading = false,
                                         }: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: pageSize,
            },
        },
    });

    return (
        <div className="space-y-4">
            <div className="relative admin-card !p-0 overflow-hidden border-slate-200/60 shadow-sm">

                {/* Overlay Loading phẳng, không làm phiền thị giác */}
                {isLoading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px] transition-all">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-100 shadow-sm">
                            <Loader2 size={16} className="animate-spin text-slate-400" />
                            <span className="text-xs font-medium text-slate-500">Đang tải dữ liệu...</span>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full border-separate border-spacing-0">
                        <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="h-12 px-6 text-left align-middle font-bold text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100 bg-slate-50/50"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody className={cn("divide-y divide-slate-100", isLoading && "opacity-40")}>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="group hover:bg-slate-50/80 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-6 py-4 text-sm text-slate-600">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="h-40 text-center text-slate-400 italic text-sm">
                                    {isLoading ? "" : "Không có dữ liệu hiển thị."}
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-2">
                <div className="text-xs font-medium text-slate-400 uppercase tracking-tight">
                    Trang <span className="text-slate-900">{table.getState().pagination.pageIndex + 1}</span> /{" "}
                    <span className="text-slate-900">{table.getPageCount()}</span>
                </div>

                <div className="flex items-center gap-1.5">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="w-8 h-8 !p-0 border-transparent bg-slate-100/50 hover:bg-slate-100"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage() || isLoading}
                    >
                        <ChevronsLeft size={14} />
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="w-8 h-8 !p-0 border-transparent bg-slate-100/50 hover:bg-slate-100"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage() || isLoading}
                    >
                        <ChevronLeft size={14} />
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="w-8 h-8 !p-0 border-transparent bg-slate-100/50 hover:bg-slate-100"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage() || isLoading}
                    >
                        <ChevronRight size={14} />
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="w-8 h-8 !p-0 border-transparent bg-slate-100/50 hover:bg-slate-100"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage() || isLoading}
                    >
                        <ChevronsRight size={14} />
                    </Button>
                </div>
            </div>
        </div>
    );
}