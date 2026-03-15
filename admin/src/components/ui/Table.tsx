import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {Button, Form, Input, Pagination, Table} from "@heroui/react";
import type {TypesPaginationData} from "@/api";
import {type NonUndefined, useForm} from "react-hook-form";

type PaginationData<T> = NonUndefined<TypesPaginationData> & {
    items?: T[]
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    isLoading?: boolean; // Thêm prop loading
    paginationData: PaginationData<TData>;
    setPage: (newPage: number) => void;
    forms?: { name: string, title: string }[]
    onFormSubmit?: (data: Record<string, string>) => void;
}

export function DataTable<TData, TValue>({
                                             columns,
                                             isLoading = false,
                                             paginationData,
                                             setPage: _setPage,
                                             forms = [],
                                             onFormSubmit
                                         }: DataTableProps<TData, TValue>) {
    const {items, page = 1, size = 24, total} = paginationData

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

    const {register, handleSubmit, reset} = useForm()
    const onSubmit = handleSubmit((data: Record<string, string>) => {
        if (onFormSubmit)
            onFormSubmit(data)
    })

    console.log(isLoading)
    return (
        <div className='space-y-6'>
            {!!forms.length && (
                <Form className='space-y-4' onSubmit={onSubmit}>
                    <div className='grid grid-cols-2 gap-4'>
                        {forms?.map((form) => (
                            <Input key={form.name} {...register(form.name)} placeholder={form.title}/>
                        ))}
                    </div>


                    <div className='flex gap-4'>
                        <Button type='reset'
                                variant='outline'
                                onClick={() => reset()}>Đặt lại</Button>
                        <Button type='submit'>Tìm kiếm</Button>

                    </div>
                </Form>
            )}

            <Table>
                <Table.ScrollContainer aria-label='table-container'>
                    <Table.Content aria-label='table'>
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
                <Table.Footer>
                    <Pagination size='sm'>
                        <Pagination.Content>
                            <Pagination.Item>
                                <Pagination.Previous isDisabled={page === 1} onPress={() => _setPage(page + 1)}>
                                    <Pagination.PreviousIcon/>
                                    <span>Trước</span>
                                </Pagination.Previous>
                            </Pagination.Item>

                            {getPageNumbers().map((value, i) => (
                                <Pagination.Item key={i + 1}>
                                    <Pagination.Link
                                        isActive={i + 1 === page}
                                        onPress={() => {
                                            if (typeof value === 'number') {
                                                _setPage(i + 1)
                                            }
                                        }}
                                    >
                                        {typeof value === 'number' ? value : '...'}
                                    </Pagination.Link>
                                </Pagination.Item>
                            ))}

                            <Pagination.Item>
                                <Pagination.Next isDisabled={page === totalPages} onPress={() => _setPage(page + 1)}>
                                    <span>Sau</span>
                                    <Pagination.NextIcon/>
                                </Pagination.Next>
                            </Pagination.Item>
                        </Pagination.Content>
                    </Pagination>
                </Table.Footer>
            </Table>
        </div>
    );
}