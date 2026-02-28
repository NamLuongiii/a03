import {Menu} from '@headlessui/react';
import styled from 'styled-components';
import {useAuth} from "../auth.tsx";
import {AuthModal} from "@components/AuthModal.tsx";
import Avatar from "boring-avatars";

// --- Styled Components ---
const MenuWrapper = styled.div`
  position: relative;
  display: inline-block;
  text-align: left;
`;

const StyledMenuButton = styled(Menu.Button)`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 50%;
  transition: background 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const StyledMenuItems = styled(Menu.Items)`
  position: absolute;
  right: 0;
  margin-top: 8px;
  width: 160px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 4px;
  z-index: 50;
  outline: none;
`;

const StyledMenuItem = styled.button<{ $active?: boolean }>`
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  background-color: ${props => (props.$active ? '#f3f4f6' : 'transparent')};
  color: ${props => (props.$active ? '#111827' : '#374151')};
  cursor: pointer;
`;

// --- Component Chính ---
export function HeaderUser() {
    const { isAuthenticated, logout, me } = useAuth(); // Giả định useAuth có logout

    if (!isAuthenticated) return <AuthModal />;

    return (
        <MenuWrapper>
            <Menu>
                {() => (
                    <>
                        <StyledMenuButton>
                            <Avatar
                                name={me?.name || "User"}
                                variant="beam"
                                size={32}
                            />
                        </StyledMenuButton>

                        {/* Render Items khi Menu được mở */}
                        <StyledMenuItems>
                            <Menu.Item>
                                {({ active }) => (
                                    <StyledMenuItem $active={active}>
                                        Trang cá nhân
                                    </StyledMenuItem>
                                )}
                            </Menu.Item>

                            <Menu.Item>
                                {({ active }) => (
                                    <StyledMenuItem
                                        $active={active}
                                        onClick={logout}
                                        style={{ color: '#dc2626' }} // Màu đỏ cho nút Logout
                                    >
                                        Đăng xuất
                                    </StyledMenuItem>
                                )}
                            </Menu.Item>
                        </StyledMenuItems>
                    </>
                )}
            </Menu>
        </MenuWrapper>
    );
}