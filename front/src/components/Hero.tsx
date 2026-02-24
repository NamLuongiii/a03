import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 1rem;
    border: 1px solid #e5e7eb;
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
      <Title>Đọc và tải sách online hoàn toàn miễn phí</Title>
      <Subtitle>Tổng hợp các nguồn sách sưu tầm trên internet</Subtitle>
    </Container>
  );
};
