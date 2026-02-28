import {Link} from "@tanstack/react-router";
import styled from "styled-components";
import {SearchBox} from "@components/SearchBox.tsx";
import {HeaderUser} from "@components/HeaderUser.tsx";
import {CategorySelect} from "@components/CategorySelect.tsx";

// --- Styled Components ---

const HeaderStyled = styled.header`
    position: sticky;
    top: 0;
    z-index: 10;
    
    /* Sử dụng biến CSS từ main.css */
    background-color: var(--surface-color);
    border-bottom: 1px solid var(--border-color);
    backdrop-filter: blur(12px); /* Tạo hiệu ứng kính mờ nhẹ nếu surface-color có opacity */
    
    padding: 0 2rem;
    height: 64px; /* Fix cứng chiều cao để Header trông chắc chắn (Industrial) */
    
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    @media (max-width: 768px) {
        display: none;
    }
`;

const Logo = styled(Link)`
    /* Kế thừa từ h1/h2 trong main.css */
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--text-main);
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    
    /* Hiệu ứng hover tinh tế */
    &:hover {
        opacity: 0.7;
    }
`;

const NavContent = styled.div`
    display: flex;
    align-items: center;
    gap: 1.5rem; /* Tăng gap cho thoáng */
    flex: 1;
    justify-content: center; /* Đẩy cụm search vào giữa */
    max-width: 600px;
    margin: 0 2rem;
`;

const UserSection = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    min-width: 120px;
    justify-content: flex-end;
`;

// --- Component ---

export function HeaderDesktop() {
    return (
        <HeaderStyled>
            {/* Cánh trái: Logo */}
            <Logo to="/">BookOn</Logo>

            {/* Cánh giữa: Search & Categories */}
            <NavContent>
                <CategorySelect />
                <SearchBox />
            </NavContent>

            {/* Cánh phải: User (Avatar/Login) */}
            <UserSection>
                <HeaderUser />
            </UserSection>
        </HeaderStyled>
    );
}