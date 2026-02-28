import styled, {css} from 'styled-components';
import {Item} from './Item';
import type {ModelsBook, TypesPaginationData} from "../api/data-contracts.ts";
import {useNavigate} from '@tanstack/react-router';

// --- Styled Components ---

const Container = styled.div`
  width: 100%;
  padding: 2rem 0;
`;

const Grid = styled.div`
  display: grid;
  /* Mặc định cho mobile: 2 cột để tiết kiệm diện tích */
  grid-template-columns: repeat(2, 1fr); 
  gap: 1.5rem;
  margin-bottom: 4rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(6, 1fr); /* Giảm xuống 6 để item to, rõ nét hơn 8 */
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  border-top: 1px solid #e4e4e7;
  padding-top: 2rem;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.75rem;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid transparent;
  border-radius: 0; /* Modern Sharp */
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: transparent;
  color: #71717a;

  &:hover:not(:disabled) {
    background-color: #f4f4f5;
    color: #18181b;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  ${props => props.$active && css`
    border-color: #18181b;
    background-color: #18181b;
    color: #ffffff;
    &:hover {
      background-color: #18181b;
      color: #ffffff;
    }
  `}

  /* Style riêng cho nút Prev/Next text */
  &.nav-text {
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 12px;
    font-weight: 700;
  }
`;

// --- Logic Component ---

type Props = {
    data: TypesPaginationData
}

export const ItemGrid = ({ data }: Props) => {
    const navigate = useNavigate({ from: "/books" });

    const currentPage = data.page || 1;
    const total = data.total || 0;
    const size = data.size || 0;
    const books = (data.items || []) as ModelsBook[];

    const totalPages = (!total || !size) ? 1 : Math.ceil(total / size);

    const handlePageChange = (newPage: number) => {
        if (newPage === currentPage) return;
        navigate({
            search: (prev: any) => ({ ...prev, page: newPage }),
        }).then(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    return (
        <Container>
            <Grid>
                {books.map((book) => (
                    <Item key={book.id} book={book} />
                ))}
            </Grid>

            {totalPages > 1 && (
                <PaginationContainer>
                    <PageButton
                        className="nav-text"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </PageButton>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PageButton
                            key={page}
                            onClick={() => handlePageChange(page)}
                            $active={currentPage === page}
                        >
                            {page}
                        </PageButton>
                    ))}

                    <PageButton
                        className="nav-text"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </PageButton>
                </PaginationContainer>
            )}
        </Container>
    );
};