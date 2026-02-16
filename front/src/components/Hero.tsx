import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 1rem;
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    font-size: 3.75rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #4b5563;
  text-align: center;
  max-width: 42rem;

  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const Hero = () => {
  return (
    <Container>
      <Title>Welcome to Our Platform</Title>
      <Subtitle>Discover amazing products and services tailored just for you</Subtitle>
    </Container>
  );
};
