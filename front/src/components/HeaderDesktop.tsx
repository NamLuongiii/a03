import {Link} from "@tanstack/react-router";
import styled from "styled-components";
import {SearchBox} from "@components/SearchBox.tsx";
import {HeaderUser} from "@components/HeaderUser.tsx";
import {CategorySelect} from "@components/CategorySelect.tsx";


const HeaderStyled = styled.header`
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--bg-header);

    @media (max-width: 768px) {
        display: none;
    }
`

const Logo = styled(Link)`
    font-size: 1.5rem;
    text-decoration: none;
    background: var(--gradient-logo);
    background-clip: text;
    color: transparent;
    font-weight: bold;
    word-spacing: 2px;
`

const Container = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
`

export function HeaderDesktop() {
    // const {isAuthenticated, logout, me} = useAuth()
    // // const [theme, setTheme] = useState<Theme>(Theme.LIGHT)
    // const navigate = useNavigate()
    //
    // const onLogin = () => {
    //     navigate({to: '/login'}).then()
    // }
    //
    // const onSignup = () => {
    //     navigate({to: '/register'}).then()
    // }

    return (
        <HeaderStyled>
            <Logo to="/">BookOn</Logo>

            <Container>
                <CategorySelect/>
                <SearchBox/>
            </Container>


            <HeaderUser/>
        </HeaderStyled>
    );
}