import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8rem 1rem;
`;

const Title = styled.h1`
  font-size: 1.4rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
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
      <Title>Đọc sách online miễn phí</Title>
      <Subtitle>Nguồn sưu tầm trên Internet</Subtitle>
    </Container>
  );
};
