import {useState} from 'react';
import {Dialog} from '@headlessui/react';
import styled from 'styled-components';
import {useNavigate} from "@tanstack/react-router";
import Avatar from "boring-avatars";


const Overlay = styled.div`
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
`;

const Panel = styled(Dialog.Panel)`
    background: white;
    border-radius: 0.5rem;
    padding: 2rem;
    max-width: 28rem;
    width: 100%;
    position: relative;
`;

const CloseButton = styled.button`
    position: absolute;
    right: 1rem;
    top: 1rem;
    color: #6b7280;
    background: transparent;
    border: none;
    cursor: pointer;

    &:hover {
        color: #374151;
    }
`;

const Title = styled(Dialog.Title)`
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
    color: #4b5563;
    margin-bottom: 1.5rem;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;

const SignInButton = styled.button`
    width: 100%;
    padding: 0.5rem 1rem;
    background-color: #3b82f6;
    color: white;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;

    &:hover {
        background-color: #2563eb;
    }
`;

const SignUpButton = styled.button`
    width: 100%;
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    background: transparent;
    cursor: pointer;

    &:hover {
        background-color: #f9fafb;
    }
`;

export const AuthModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate()

    const login = () => {
        navigate({to: '/login'}).then()
        setIsOpen(false)
    }

    const register = () => {
        setIsOpen(false)
        navigate({to: '/register'}).then()
    }
    return (
        <>
            <Avatar onClick={() => setIsOpen(true)}>Open Auth</Avatar>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <Overlay>
                    <Panel>
                        <CloseButton onClick={() => setIsOpen(false)}>✕</CloseButton>
                        <Title>Welcome Back</Title>
                        <Subtitle>Sign in to continue to your account</Subtitle>
                        <ButtonContainer>
                            <SignInButton onClick={login}>Sign In</SignInButton>
                            <SignUpButton onClick={register}>Sign Up</SignUpButton>
                        </ButtonContainer>
                    </Panel>
                </Overlay>
            </Dialog>
        </>
    );
};
