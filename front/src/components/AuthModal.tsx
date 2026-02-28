import {Fragment, useState} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import styled from 'styled-components';
import {useNavigate} from "@tanstack/react-router";
import Avatar from "boring-avatars";
import {X} from "lucide-react";
import {Button} from "@components/ui/Button.tsx";

// --- Styled Components ---

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.7); /* Màu trắng trong suốt nhẹ */
  backdrop-filter: blur(8px); /* Hiệu ứng blur hiện đại */
  z-index: 40;
`;

const ModalWrapper = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
`;

const StyledPanel = styled(Dialog.Panel)`
  background: white;
  width: 100%;
  max-width: 360px;
  border: 1px solid #e4e4e7; /* Viền mỏng màu Zinc */
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
  padding: 2.5rem 2rem;
  position: relative;
  /* Giữ style vuông vức modern */
  border-radius: 0; 
`;

const CloseButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 1rem;
  color: #a1a1aa;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  transition: color 0.2s;

  &:hover {
    color: #18181b;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled(Dialog.Title)`
  font-size: 1.25rem;
  font-weight: 600;
  color: #18181b;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Description = styled.p`
  color: #71717a;
  font-size: 0.875rem;
`;

const ActionStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

// --- Component Chính ---

export const AuthModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleAction = (path: string) => {
        setIsOpen(false);
        navigate({ to: path });
    };

    return (
        <>
            {/* Trigger - Tận dụng Avatar làm nút bấm */}
            <div onClick={() => setIsOpen(true)} style={{ cursor: 'pointer' }}>
                <Avatar size={32} variant="beam" />
            </div>

            <Transition show={isOpen} as={Fragment}>
                <Dialog onClose={() => setIsOpen(false)}>
                    {/* 1. Backdrop với hiệu ứng Blur */}
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Backdrop aria-hidden="true" />
                    </Transition.Child>

                    {/* 2. Nội dung Modal */}
                    <ModalWrapper>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <StyledPanel>
                                <CloseButton onClick={() => setIsOpen(false)}>
                                    <X size={20} />
                                </CloseButton>

                                <Header>
                                    <Title>Đăng nhập</Title>
                                    <Description>Chào mừng bạn quay trở lại</Description>
                                </Header>

                                <ActionStack>
                                    <Button
                                        fullWidth
                                        onClick={() => handleAction('/login')}
                                    >
                                        Đăng nhập ngay
                                    </Button>

                                    <Button
                                        variant="outline"
                                        fullWidth
                                        onClick={() => handleAction('/register')}
                                    >
                                        Tạo tài khoản mới
                                    </Button>
                                </ActionStack>
                            </StyledPanel>
                        </Transition.Child>
                    </ModalWrapper>
                </Dialog>
            </Transition>
        </>
    );
};