import {createFileRoute} from '@tanstack/react-router';
import styled from 'styled-components';
import {Filter, Footer, Hero, ItemGrid} from '@components';

export const Route = createFileRoute('/_public/books')({
    component: Books,
});

function Books() {
    return (
        <Screen>
            <Hero/>
            <Filter/>
            <Container>
                <ItemGrid/>
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
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
`;
