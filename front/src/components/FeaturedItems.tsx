import styled from 'styled-components';
import { Item } from './Item';

const Container = styled.div`
  padding: 2rem 1rem;
`;

const Title = styled.h2`
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #4b5563;
  margin-bottom: 1.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const FeaturedItems = () => {
  const items = [
    { name: 'Product 1', subname: 'Category A' },
    { name: 'Product 2', subname: 'Category B' },
    { name: 'Product 3', subname: 'Category C' },
    { name: 'Product 4', subname: 'Category D' },
  ];

  return (
    <Container>
      <Title>Featured Items</Title>
      <Subtitle>Check out our most popular products</Subtitle>
      <Grid>
        {items.map((item, index) => (
          <Item key={index} name={item.name} subname={item.subname} />
        ))}
      </Grid>
    </Container>
  );
};
