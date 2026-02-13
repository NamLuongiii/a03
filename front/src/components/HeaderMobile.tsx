import {Link} from "@tanstack/react-router";
import styled from "styled-components";
import {HeaderUser} from "@components/HeaderUser.tsx";
import {LucideMenu} from "lucide-react";

const HeaderStyled = styled.header`
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (min-width: 768px) {
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

export function HeaderMobile() {
    return (
        <HeaderStyled>
            <Logo to="/">BookOn</Logo>

            <HeaderUser/>

            <LucideMenu/>
        </HeaderStyled>
    );
}