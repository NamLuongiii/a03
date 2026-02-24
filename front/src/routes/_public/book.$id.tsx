import {createFileRoute} from '@tanstack/react-router';
import styled from 'styled-components';
import {Comments, Footer, ItemDetail} from '@components';
import {useQuery} from "@tanstack/react-query";
import {apiBooks} from "../../services/ApiGenerate.ts";
import {Loading} from "@components/Loading.tsx";
import type {ModelsBook} from "../../api/data-contracts.ts";

export const Route = createFileRoute('/_public/book/$id')({
    component: BookDetail,
});

function BookDetail() {
    const {id} = Route.useParams();

    const {data, isLoading} = useQuery({
        queryKey: ['book-detail', id],
        queryFn: () => apiBooks.booksDetail({
            id: id,
        })
    })

    const book = data?.data.data as ModelsBook | undefined;

    return (
        <Screen>

            {isLoading ? <Loading/> : (
                <Container>
                    {book && (
                        <ItemDetail book={book}/>
                    )}

                    <div>
                        <h2>Lời tựa</h2>
                        <div>
                            {book?.summary}
                        </div>
                    </div>
                    <Comments bookID={id}/>
                </Container>
            )}


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
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

