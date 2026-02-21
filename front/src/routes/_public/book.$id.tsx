import {createFileRoute} from '@tanstack/react-router';
import styled from 'styled-components';
import {Comments, Footer, ItemDetail} from '@components';

export const Route = createFileRoute('/_public/book/$id')({
    component: BookDetail,
});

function BookDetail() {
    const {id} = Route.useParams();

    return (
        <Screen>
            <Container>
                <Title>Book Detail - ID: {id}</Title>
                <ItemDetail/>
                <Comments/>
            </Container>

            <Footer/>
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
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
`;

const Title = styled.h1`
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 2rem;
`;
