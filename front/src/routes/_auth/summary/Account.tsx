import {useAuth} from "../../../auth.tsx";
import {Link} from "@tanstack/react-router";
import styled from "styled-components";
import {Button} from "../../../components/ui/Button.tsx";

export function Account() {
    const {me, logout} = useAuth()
    return <Container>
        <div>{me?.email}</div>

        <Link to='/profile'><Button>Edit profile</Button></Link>

        <Button type='button' onClick={logout}>Logout</Button>
    </Container>
}

const Container = styled.div`
    padding: 2rem;

    & > * {
        margin-bottom: 1rem;
    }
`