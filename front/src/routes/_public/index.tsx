import {createFileRoute} from '@tanstack/react-router'
import styled from "styled-components";
import {FeaturedItems, Footer, Hero} from "@components";
import {useQuery} from "@tanstack/react-query";
import {apiBooks} from "../../services/ApiGenerate.ts";

export const Route = createFileRoute('/_public/')({
    component: Index,
})


function Index() {

    const {data: newBooksData} = useQuery({
        queryKey: ['featured-items-news'],
        queryFn: () => apiBooks.featuredList({recommender: "new-books"})
    })

    return <Screen>
        <Hero/>
        {newBooksData && (
            <FeaturedItems books={newBooksData.data.data}/>)}

        <Footer/>
    </Screen>
}


const Screen = styled.div`
    & > *:not(:last-child) {
        margin-bottom: 4rem;
        padding: 2rem;
    }
`


