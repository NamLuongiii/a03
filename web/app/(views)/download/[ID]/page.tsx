import {Breadcrumbs, Button, Table} from "@heroui/react";
import {getBooksById} from "@/app/api";
import BookInformation from "@/app/components/BookInformation";
import prettyBytes from "pretty-bytes";
import {FileTypeKey, FileTypes} from "@/app/api/types";
import {getFullUrl} from "@/app/helpers";
import Link from "next/link";

type Props = {
    params: Promise<{ ID: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DownloadPage({params}: Props) {
    const {ID} = await params;
    const {data} = await getBooksById({path: {id: ID}});
    const book = data?.data;

    if (!book) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h1 className="text-2xl font-bold">Không tìm thấy sách</h1>
                <Button className="mt-4">Về trang chủ</Button>
            </div>
        );
    }
    return <div className='space-y-8'>
        <Breadcrumbs>
            <Breadcrumbs.Item href='/'>Trang chủ</Breadcrumbs.Item>
            <Breadcrumbs.Item href={`/books/${book.id}`}>{book.name}</Breadcrumbs.Item>
            <Breadcrumbs.Item>Tải về</Breadcrumbs.Item>
        </Breadcrumbs>

        <BookInformation book={book}/>

        <Table>
            <Table.ScrollContainer>
                <Table.Content aria-label="Download file">

                    <Table.Header>
                        <Table.Column isRowHeader>Loại file</Table.Column>
                        <Table.Column>Dung lượng</Table.Column>
                        <Table.Column>Tải về</Table.Column>
                    </Table.Header>
                    <Table.Body>
                        {book.digital_books?.map(db => (
                            <Table.Row key={db.id}>
                                <Table.Cell>{FileTypes[db.file_type as FileTypeKey]}</Table.Cell>
                                <Table.Cell>{prettyBytes(db.file_size || 0)}</Table.Cell>
                                <Table.Cell>
                                    <Link href={getFullUrl(db.url)} download={db.name}>
                                        <Button type="button" variant="secondary">
                                            Download
                                        </Button>
                                    </Link>

                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Content>
            </Table.ScrollContainer>
        </Table>
    </div>
}