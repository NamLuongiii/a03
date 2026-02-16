import { createFileRoute } from '@tanstack/react-router';
import styled from 'styled-components';
import { ItemGrid, Footer } from '@components';

export const Route = createFileRoute('/_public/author/$slug')({
  component: AuthorPage,
});

function AuthorPage() {
  const { slug } = Route.useParams();

  return (
    <Screen>
      <Container>
        <Header>
          <Avatar>👤</Avatar>
          <AuthorInfo>
            <Name>Author: {slug}</Name>
            <Bio>
              This is the author's biography. A brief description about their work,
              achievements, and writing style.
            </Bio>
          </AuthorInfo>
        </Header>
        <Section>
          <SectionTitle>Books by this author</SectionTitle>
          <ItemGrid />
        </Section>
      </Container>
      <Footer />
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
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 3rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  flex-shrink: 0;
`;

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Name = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #111827;
`;

const Bio = styled.p`
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.6;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #111827;
`;
