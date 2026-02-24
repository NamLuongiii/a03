import styled from 'styled-components';
import {Item} from './Item';
import type {ModelsBook, TypesPaginationData} from "../api/data-contracts.ts";
import {useNavigate} from '@tanstack/react-router'

const Container = styled.div`
    padding: 1.5rem 1rem;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 2rem;

    @media (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 768px) {
        grid-template-columns: repeat(4, 1fr);
    }

    @media (min-width: 1024px) {
        grid-template-columns: repeat(8, 1fr);
    }
`;

const Pagination = styled.div`
    display: flex;
    justify-content: center;
    gap: 0.5rem;
`;

const Button = styled.button<{ $active?: boolean }>`
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    background-color: ${props => props.$active ? '#3b82f6' : 'white'};
    color: ${props => props.$active ? 'white' : 'black'};
    cursor: pointer;

    &:hover:not(:disabled) {
        background-color: ${props => props.$active ? '#2563eb' : '#f9fafb'};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

type Props = {
    data: TypesPaginationData
}

export const ItemGrid = ({data}: Props) => {
    const currentPage = data.page || 1
    const total = data.total || 0
    const size = data.size || 0
    const navigate = useNavigate({ from: "/books" })

    const totalPages = (!total || !size) ? 1 : Math.ceil(total / size)

    const handlePageChange = (newPage: number) => {
        navigate({
            search: (prev) => ({ ...prev, page: newPage }),
        }).then()
    };

    const books = data.items as ModelsBook[];
    return (
        <Container>
            <Grid>
                {books.map((book) => (
                    <Item key={book.id} book={book}/>
                ))}
            </Grid>

            <Pagination>
                <Button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                    <Button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        $active={currentPage === page}
                    >
                        {page}
                    </Button>
                ))}
                <Button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </Pagination>
        </Container>
    );
};
