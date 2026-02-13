import {createFileRoute} from '@tanstack/react-router'
import styled from "styled-components";
import {useState} from "react";
import Profile from "./Profile.tsx";
import {Account} from "./Account.tsx";

export const Route = createFileRoute('/_auth/summary/')({
    component: RouteComponent,
})


function RouteComponent() {
    const [tab, setTab] = useState<number>(0)

    return <Container>
        <Left>
            <li onClick={() => setTab(0)}>Dashboard</li>
            <li onClick={() => setTab(1)}>Account</li>
        </Left>

        <Main>
            {tab === 0 ? <Profile/> : <Account/>}
        </Main>
    </Container>
}

const Container = styled.div`
    display: flex;
    gap: 2rem;
`

const Left = styled.ul`
    width: fit-content;
    gap: 1rem;
    list-style: none;
    font-size: 1.5rem;
    padding: 2rem;

    & > li {
        margin-bottom: 1rem;
    }

    li {
        padding: 1rem;
        border-radius: 1rem;
        background-color: var(--surface-color);
        cursor: pointer;
        transition: background-color 0.2s ease-in-out;

        &:hover {
            background-color: var(--surface-color);
        }
    }
`

const Main = styled.main`
    flex: 1;
`