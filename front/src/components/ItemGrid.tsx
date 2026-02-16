import { useState } from 'react';
import styled from 'styled-components';
import { Item } from './Item';

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
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
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

export const ItemGrid = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const items = Array.from({ length: 12 }, (_, i) => ({
    name: `Product ${i + 1}`,
    subname: `Category ${String.fromCharCode(65 + (i % 5))}`,
  }));

  return (
    <Container>
      <Grid>
        {items.map((item, index) => (
          <Item key={index} name={item.name} subname={item.subname} />
        ))}
      </Grid>

      <Pagination>
        <Button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            onClick={() => setCurrentPage(page)}
            $active={currentPage === page}
          >
            {page}
          </Button>
        ))}
        <Button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Pagination>
    </Container>
  );
};
