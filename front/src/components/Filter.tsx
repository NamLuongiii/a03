import styled from 'styled-components';
import {useSearch} from '@tanstack/react-router';

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 2rem;
  font-size: 13px;
`;

const Label = styled.span`
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
`;

const FilterValue = styled.span`
  color: var(--text-main);
  font-weight: 600;
  
  /* Dấu gạch đứng phân cách các filter */
  &:not(:last-child)::after {
    content: "/";
    margin: 0 0.75rem;
    color: var(--border-color);
    font-weight: 300;
  }
`;

export const Filter = () => {
    const search = useSearch({ from: '/_public/books' });

    // Nếu không có filter nào thì không hiện gì cả
    if (!search.search && !search.category) return null;

    return (
        <Container>
            <Label>Đang xem:</Label>
            <div>
                {search.category && (
                    <FilterValue>Thể loại: {search.category}</FilterValue>
                )}
                {search.search && (
                    <FilterValue>Tìm kiếm: "{search.search}"</FilterValue>
                )}
            </div>
        </Container>
    );
};