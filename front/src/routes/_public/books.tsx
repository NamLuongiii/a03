import {createFileRoute} from '@tanstack/react-router';
import styled from 'styled-components';
import {Filter, Footer, ItemGrid} from '@components';
import {useQuery} from "@tanstack/react-query";
import {apiBooks} from "../../services/ApiGenerate.ts";
import {Loading} from "@components/Loading.tsx";
import {z} from "zod";
import type {TypesPaginationData} from "../../api/data-contracts.ts";

// Định nghĩa schema cho Query Params
const booksSearchSchema = z.object({
    page: z.number().optional().default(1),
    size: z.number().optional().default(12),
    category: z.string().optional(),
    search: z.string().optional(),
});

// Ép kiểu TypeScript từ Zod schema
// type BooksSearch = z.infer<typeof booksSearchSchema>;

export const Route = createFileRoute('/_public/books')({
    // Thêm validateSearch vào route định nghĩa
    validateSearch: (search) => booksSearchSchema.parse(search),
    component: Books,

});

function Books() {
    // 1. Lấy query params từ URL (đã được định nghĩa ở trên)
    const { page, size, category, search } = Route.useSearch();

    // 2. Đưa params vào useQuery
    const { data, isLoading } = useQuery({
        // Quan trọng: Thêm params vào queryKey để React Query fetch lại khi URL thay đổi
        queryKey: ['books-by-filter', { page, size, category, search }],
        queryFn: () => apiBooks.booksList({
            page,
            size,
            category,
            search
        })
    });

    const paginationData = data?.data.data as TypesPaginationData | undefined;
    
    return (
        <Screen>
            {isLoading && <Loading/>}
            <Container>
                <Filter/>
                {!!paginationData && (<ItemGrid data={paginationData}/>)}
            </Container>
            <Footer/>
        </Screen>
    );
}

const Screen = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const Container = styled.div`
    flex: 1;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
`;
