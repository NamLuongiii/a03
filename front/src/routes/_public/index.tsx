import {createFileRoute} from '@tanstack/react-router'
import styled from "styled-components";

export const Route = createFileRoute('/_public/')({
    component: Index,
})


function Index() {

    return <Screen>
        hello
    </Screen>
}


const Screen = styled.div`
    & > *:not(:last-child) {
        margin-bottom: 4rem;
        padding: 2rem;
    }
`


