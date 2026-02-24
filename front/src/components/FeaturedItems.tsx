import styled from 'styled-components';
import {Item} from './Item';
import type {ModelsBook} from "../api/data-contracts.ts";

const Container = styled.div`
    padding: 0 1rem;
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
        grid-template-columns: repeat(10, 1fr);
    }
`;

type Props = {
    books: ModelsBook[]
}

export const FeaturedItems = ({books}: Props) => {
    return (
        <Container>
            <Title>Sách mới</Title>
            <Subtitle>Khám phá top sách mới được upload</Subtitle>
            <Grid>
                {books.map((item, index) => (
                    <Item key={index} book={item}/>
                ))}
            </Grid>
        </Container>
    );
};
