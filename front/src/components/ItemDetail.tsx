import styled from 'styled-components';
import {Link} from "@tanstack/react-router";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 1.5rem;

    @media (min-width: 768px) {
        flex-direction: row;
    }
`;

const LeftSection = styled.div`
    flex-shrink: 0;
    width: 100%;
    max-width: 300px;

    @media (min-width: 768px) {
        max-width: 250px;
    }
`;

const ImagePlaceholder = styled.div`
    width: 100%;
    aspect-ratio: 3 / 4;
    background-color: #e5e7eb;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    font-size: 1.125rem;
`;

const RightSection = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Title = styled.h1`
    font-size: 1.875rem;
    font-weight: bold;
    color: #111827;

    @media (min-width: 768px) {
        font-size: 2.25rem;
    }
`;

const Description = styled.p`
    font-size: 1rem;
    color: #4b5563;
    line-height: 1.6;
`;

const DetailText = styled.p`
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.5;
`;
const slug = 'book-slug';

export const ItemDetail = () => {

    return (
        <Container>
            <LeftSection>
                <ImagePlaceholder>📖 Image</ImagePlaceholder>
            </LeftSection>
            <RightSection>
                <Title>Book Title</Title>
                <Description>
                    This is a detailed description of the book. It provides an overview of the content,
                    themes, and what readers can expect from this amazing piece of literature.
                </Description>
                <DetailText>
                    Author: <Link to={`/author/${slug}`}>John Doe</Link><br/>
                    Publisher: Example Press<br/>
                    Year: 2024<br/>
                    Pages: 320
                </DetailText>
            </RightSection>
        </Container>
    );
};
