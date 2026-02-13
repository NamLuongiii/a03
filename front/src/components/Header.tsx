import {Link, useNavigate} from "@tanstack/react-router";
import {useAuth} from "../auth.tsx";
import styled from "styled-components";
import Avatar from "boring-avatars";
import {motion} from "motion/react"
import {Button} from "./ui/Button.tsx";

// enum Theme {
//     LIGHT = 'light',
//     DARK = 'dark',
// }

const HeaderStyled = styled.header`
    border-bottom: 1px solid var(--border-color);
    background-color: var(--bg-header);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    gap: 2rem;

    position: sticky;
    top: 0;
    z-index: 10;
    backdrop-filter: blur(10px);
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

export function Header() {
    const {isAuthenticated, logout, me} = useAuth()
    // const [theme, setTheme] = useState<Theme>(Theme.LIGHT)
    const navigate = useNavigate()

    const changeMode = () => {
        const document = window.document;
        const currentTheme = document.documentElement.getAttribute('aria-theme');

        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('aria-theme', 'light');
        } else {
            document.documentElement.setAttribute('aria-theme', 'dark');
        }
        // setTheme(currentTheme === 'dark' ? Theme.LIGHT : Theme.DARK)
    }

    const onLogin = () => {
        navigate({to: '/login'}).then()
    }

    const onSignup = () => {
        navigate({to: '/register'}).then()
    }


    return (
        <HeaderStyled>
            <Logo to="/">World</Logo>

            <motion.button
                // whileHover={{
                //     rotate: 45
                // }}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    marginLeft: 'auto'
                }}
                onClick={changeMode}>
            </motion.button>

            {isAuthenticated ? <>
                <Avatar name={me?.name} onClick={logout}>Logout</Avatar>
            </> : <>
                <div style={{
                    cursor: 'pointer'
                }} onClick={onLogin}>Login
                </div>
                <Button
                    type='button'
                    onClick={onSignup}
                    style={{
                        borderRadius: '2rem',
                    }}>
                    Signup
                </Button>
            </>}
        </HeaderStyled>
    );
}