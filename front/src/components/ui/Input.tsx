import styled, {css} from "styled-components";
import * as React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
`;

const Label = styled.label`
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #71717a;
`;

const StyledInput = styled.input<{ $hasError?: boolean }>`
    width: 100%;
    padding: 12px 16px;
    background: #fdfdfd;
    border: 1px solid ${props => props.$hasError ? '#ef4444' : '#e4e4e7'};
    border-radius: 0; /* Modern Sharp */
    font-size: 14px;
    color: #18181b;
    transition: all 0.2s ease-in-out;
    outline: none;

    &::placeholder {
        color: #d4d4d8;
    }

    &:hover:not(:disabled):not(:focus) {
        border-color: #d4d4d8;
    }

    &:focus {
        background: #fff;
        border-color: #18181b;
        box-shadow: inset 0 0 0 1px #18181b;
    }

    ${props => props.$hasError && css`
        background: #fff5f5;
        &:focus {
            border-color: #ef4444;
            box-shadow: inset 0 0 0 1px #ef4444;
        }
    `}

    &:disabled {
        background: #f4f4f5;
        cursor: not-allowed;
        opacity: 0.6;
    }
`;

const ErrorMsg = styled.span`
    font-size: 12px;
    color: #ef4444;
    font-weight: 500;
`;

export const InputField = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, ...props }, ref) => {
        return (
            <Container>
                {label && <Label>{label}</Label>}
                <StyledInput
                    ref={ref}
                    $hasError={!!error}
                    {...props}
                />
                {error && <ErrorMsg>{error}</ErrorMsg>}
            </Container>
        );
    }
);

