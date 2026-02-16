import styled from 'styled-components';

const Container = styled.div`
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Content = styled.p`
  color: #374151;
`;

export const Filter = () => {
  return (
    <Container>
      <Title>Filter</Title>
      <Content>Hello World Content</Content>
    </Container>
  );
};
