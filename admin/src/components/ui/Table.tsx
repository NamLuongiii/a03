import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {Pagination, Table} from "@heroui/react";
import type {TypesPaginationData} from "@/api";
import type {NonUndefined} from "react-hook-form";

type PaginationData<T> = NonUndefined<TypesPaginationData> & {
    items?: T[]
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    isLoading?: boolean; // Thêm prop loading
    paginationData: PaginationData<TData>;
    setPage?: (newPage: number) => void;
}

export function DataTable<TData, TValue>({
                                             columns,
                                             isLoading = false,
                                             paginationData,
                                             setPage: _setPage,
                                         }: DataTableProps<TData, TValue>) {
    const {items, page = 1, size = 12, total} = paginationData

    const table = useReactTable({
        data: items || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
    });

    const totalPages = Math.ceil((total || 0) / (size || 12));

    const setPage = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        _setPage?.(newPage);

    }

    console.log(isLoading)
    return (
        <div className="space-y-4">
            <Table>
                <Table.ScrollContainer>
                    <Table.Content>
                        <Table.Header>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <Table.Row key={headerGroup.id}>
                                    {headerGroup.headers.map((header, i) => (
                                        <Table.Column
                                            isRowHeader={i === 0}
                                            key={header.id}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </Table.Column>
                                    ))}
                                </Table.Row>
                            ))}
                        </Table.Header>
                        <Table.Body>
                            {table.getRowModel().rows.map((row) => (
                                <Table.Row
                                    key={row.id}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <Table.Cell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </Table.Cell>
                                    ))}
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between p-4">
                <Pagination className="justify-center">
                    <Pagination.Content>
                        <Pagination.Item>
                            <Pagination.Previous isDisabled={page === 1} onPress={() => setPage(page + 1)}>
                                <Pagination.PreviousIcon/>
                                <span>Trước</span>
                            </Pagination.Previous>
                        </Pagination.Item>
                        {Array.from({length: totalPages}, (_, i) =>
                            <Pagination.Item key={i + 1}>
                                <Pagination.Link isActive={i + 1 === page} onPress={() => setPage(i + 1)}>
                                    {i + 1}
                                </Pagination.Link>
                            </Pagination.Item>
                        )}
                        <Pagination.Item>
                            <Pagination.Next isDisabled={page === totalPages} onPress={() => setPage(page + 1)}>
                                <span>Sau</span>
                                <Pagination.NextIcon/>
                            </Pagination.Next>
                        </Pagination.Item>
                    </Pagination.Content>
                </Pagination>
            </div>
        </div>
    );
}